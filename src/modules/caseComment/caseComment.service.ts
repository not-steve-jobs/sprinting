import {Injectable} from '@nestjs/common';
import {CaseCommentRepository} from './caseComment.repository';
import {CaseCommentDto} from './dto/caseComment.dto';
import {CreateCaseCommentDto} from './dto/createCaseComment.dto';
import {CaseComment} from './caseComment.entity';
import {CaseCommentError} from './caseComment.error';
import {FileService} from '../file/file.service';
import {File} from '../file/file.entity';
import {NotificationService} from '../notification/notification.service';
import {Notification} from '../notification/notification.entity';
import {CaseFollowerService} from '../caseFollower/caseFollower.service';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import LodashEmpty from 'lodash/isEmpty';
import {NotificationEntityName, NotificationTypeEnum} from '../notification/notification.enum';
import {CaseFollower} from '../caseFollower/caseFollower.entity';
import {TenantRepository} from '../tenant/tenant.repository';
import {UserRepository} from '../user/user.repository';
import {UserProfileRepository} from '../userProfile/userProfile.repository';
import {Case} from '../case/case.entity';

@Injectable()
export class CaseCommentService {
  constructor(
    private readonly caseCommentRepository: CaseCommentRepository,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly caseFollowerService: CaseFollowerService,
    private readonly tenantRepository: TenantRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  public async create(
    tenantId: number,
    caseComment: CreateCaseCommentDto,
    loggedUserId: string,
  ): Promise<CaseCommentDto> {
    try {
      const {caseId} = caseComment;

      const obj = new CaseComment({...caseComment, userId: caseComment.createdBy, isDraft: false});
      obj.tenantId = tenantId;
      delete obj['createdBy'];
      const createdCaseComment = await this.caseCommentRepository.save(obj);
      const caseFollowers = await this.caseFollowerService.findByCaseId(tenantId, caseId);
      const updatedCaseFollowers = [];
      const deletedCaseFollowers = [];

      const newNotifications = caseFollowers.reduce((notifications: Notification[], caseFollower) => {
        // eslint-disable-next-line
        const {tenantUser, ...extractedCaseFollowerProps} = caseFollower;
        if (
          loggedUserId &&
          caseFollower.userId === loggedUserId &&
          caseFollower.tenantId === tenantId &&
          !caseFollower.isUserFollower
        ) {
          updatedCaseFollowers.push(
            new CaseFollower({
              ...extractedCaseFollowerProps,
              isUserFollower: true,
            }),
          );
        } else if (!loggedUserId || caseFollower.userId !== loggedUserId) {
          if (caseFollower.isUserFollower) {
            updatedCaseFollowers.push(
              new CaseFollower({
                ...extractedCaseFollowerProps,
                isCaseRead: false,
              }),
            );
            if (
              caseFollower.tenantUser.notifications[0]?.isRead ||
              LodashEmpty(caseFollower.tenantUser.notifications)
            ) {
              notifications.push(
                new Notification({
                  entityId: caseId,
                  entityName: NotificationEntityName.Case,
                  tenantId,
                  userId: caseFollower.userId,
                  type: NotificationTypeEnum.NewCaseMessage,
                  isRead: false,
                }),
              );
            } else {
              notifications.push(
                new Notification({
                  ...caseFollower.tenantUser.notifications[0],
                  updatedAt: new Date(),
                }),
              );
            }
          } else {
            deletedCaseFollowers.push(caseFollower);
          }
        }
        return notifications;
      }, []);

      await this.notificationService.saveMany(newNotifications);
      await this.caseFollowerService.saveMany(updatedCaseFollowers);
      await this.caseFollowerService.deleteMany(deletedCaseFollowers);

      if (loggedUserId) {
        const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
        const user = await this.userRepository.findOne(createdCaseComment.userId);
        const userProfile = await this.userProfileRepository.findOne(user.id);
        this.infoSystemCommandsService.sendCaseCommentCreated(tenant, user, userProfile, createdCaseComment);
      }

      const createdCaseCommentDto: CaseCommentDto = createdCaseComment;
      if (createdCaseComment) {
        createdCaseCommentDto.files = await this.fileService.fetchFilesByCaseCommentId(
          tenantId,
          createdCaseCommentDto.id,
        );
      }

      return createdCaseCommentDto;
    } catch (error) {
      throw new CaseCommentError.CaseCommentCreateError(null, error);
    }
  }

  public async createDraft(
    tenantId: number,
    userId: string,
    files: Express.Multer.File[],
    payload: any,
  ): Promise<CaseCommentDto> {
    try {
      const {caseId} = payload;
      const obj = new CaseComment({tenantId, userId, ...payload, isDraft: true});
      const caseComment: CaseCommentDto =
        (await this.caseCommentRepository.findOneDraftByCaseIdAndUserId(tenantId, userId, caseId)) ??
        (await this.caseCommentRepository.save(obj));
      const path: string = `case/${caseComment.id}/file`;
      await this.fileService.uploadFiles(tenantId, userId, files, path, {
        entityId: caseComment.id,
        entityName: CaseComment.name,
      });

      if (caseComment) {
        caseComment.files = await this.fileService.fetchFilesByCaseCommentId(tenantId, caseComment.id);
      }

      return caseComment;
    } catch (error) {
      throw new CaseCommentError.CaseCommentCreateError(null, error);
    }
  }

  async fetchCaseComments(tenantId: number, caseId: string): Promise<CaseCommentDto[]> {
    try {
      const caseComments: CaseCommentDto[] = await this.caseCommentRepository.findByCaseId(tenantId, caseId);
      for (const caseComment of caseComments) {
        caseComment.files = await this.fileService.fetchFilesByCaseCommentId(tenantId, caseComment.id);
      }

      return caseComments;
    } catch (error) {
      throw new CaseCommentError.CaseCommentFetchError(null, error);
    }
  }

  async fetchDraft(tenantId: number, userId: string, caseId: string): Promise<CaseCommentDto> {
    try {
      const draft = await this.caseCommentRepository.findOneDraftByCaseIdAndUserId(tenantId, userId, caseId);
      if (draft) {
        const files = await this.fileService.fetchFilesByCaseCommentId(tenantId, draft.id);
        const commentDto: CaseCommentDto = {
          ...draft,
          files,
        };
        return commentDto;
      } else {
        return draft;
      }
    } catch (error) {
      throw new CaseCommentError.CaseCommentFetchError(null, error);
    }
  }

  async deleteCommentFile(tenantId: number, fileId: string, userId: string): Promise<File> {
    const file = await this.fileService.getFile(tenantId, fileId);
    if (!file) {
      throw new CaseCommentError.CaseCommentDeleteCommentFileError(null);
    }

    if (!file.entityId) {
      throw new CaseCommentError.CaseCommentDeleteCommentFileError(null);
    }

    if (file.entityName != CaseComment.name && file.entityName != Case.name) {
      throw new CaseCommentError.CaseCommentDeleteCommentFileError(null);
    }
    if (file.entityName === CaseComment.name) {
      const caseComment = await this.caseCommentRepository.findOneById(tenantId, file.entityId);
      if (!caseComment.isDraft) {
        // eslint-disable-next-line
        const {tenantUser, ...extractedCaseCommentProps} = caseComment;
        if (!caseComment.isDraft) {
          const obj = new CaseComment({...extractedCaseCommentProps, filesDeleted: true});
          await this.caseCommentRepository.save(obj);
        }
      }
      return await this.fileService.deleteFile(tenantId, fileId, userId, caseComment.isDraft);
    }
    return await this.fileService.deleteFile(tenantId, fileId, userId);
  }
}
