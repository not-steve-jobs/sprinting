import {Injectable} from '@nestjs/common';
import {CaseRepository} from './case.repository';
import {CaseDto} from './dto/case.dto';
import {createCaseDto} from './dto/createCase.dto';
import {Case} from './case.entity';
import {CaseError} from './case.error';
import {FilteringOptions, Pagination, PaginationOptions, SortingOptions} from '../common/paginate';
import {UpdateCaseDto} from './dto/updateCase.dto';
import {CaseFollowerService} from '../caseFollower/caseFollower.service';
import {CaseFollower} from '../caseFollower/caseFollower.entity';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {StatusService} from '../status/status.service';
import {BackgroundNotificationService} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.service';
import {User} from '../user/user.entity';
import {UserProfileService} from '../userProfile/userProfile.service';
import {StatusError} from '../status/status.error';
import {CaseCommentDto} from '../caseComment/dto/caseComment.dto';
import {CaseCommentError} from '../caseComment/caseComment.error';
import {FileService} from '../file/file.service';
import {CaseStatus} from '../status/status.enum';
import {Notification} from '../notification/notification.entity';
import {NotificationEntityName, NotificationTypeEnum} from '../notification/notification.enum';
import {NotificationService} from '../notification/notification.service';
import {TenantRepository} from '../tenant/tenant.repository';
import {InvoiceRepository} from '../invoice/invoice.repository';
import {CaseCategoryType} from '../caseCategory/caseCategory.entity';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {JobOrderAssociateCaseService} from '../jobOrderAssociateCase/jobOrderAssociateCase.service';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {CaseUpdateOrigin} from './case.constants';
import {Status} from '../status/status.entity';

@Injectable()
export class CaseService {
  constructor(
    private readonly caseRepository: CaseRepository,
    private readonly caseFollowerService: CaseFollowerService,
    private readonly statusService: StatusService,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly notify: BackgroundNotificationService,
    private readonly userProfileService: UserProfileService,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService,
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly jobOrderAssociateCaseService: JobOrderAssociateCaseService,
    private readonly appConfig: AppConfigService,
  ) {}

  public async create(tenantId: number, caseToCreate: createCaseDto): Promise<CaseDto> {
    let caseStatus;
    try {
      caseStatus = await this.statusService.getStatusByName(tenantId, CaseStatus.Open, Case.name);
    } catch (error) {
      throw new StatusError.StatusServiceNotFound(null, error);
    }
    try {
      const obj = new Case({...caseToCreate, userId: caseToCreate.createdBy, statusId: caseStatus.id});

      if (caseToCreate.caseCategoryId == CaseCategoryType.invoices && !caseToCreate.locationId) {
        const invoice = await this.invoiceRepository.findOneById(tenantId, caseToCreate.entityId);
        if (invoice) {
          obj.locationId = invoice.locationId;
        }
      }
      const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
      const newCase = await this.caseRepository.save(obj);

      if (
        [CaseCategoryType.interviewRequest, CaseCategoryType.requestCV, CaseCategoryType.candidatesAssociates].includes(
          caseToCreate.caseCategoryId,
        )
      ) {
        await this.jobOrderAssociateCaseService.create({
          tenantId,
          userId: caseToCreate.entityId,
          jobOrderId: caseToCreate.additionalProperties.jobOrderId,
          caseId: newCase.id,
        });
      }
      const objNotification = new CaseFollower({
        tenantId,
        userId: newCase.userId,
        caseId: newCase.id,
        isCaseRead: true,
        isUserFollower: true,
      });

      this.caseFollowerService.create(objNotification);
      await this.infoSystemCommandsService.sendCaseCreated(tenant, newCase);

      return newCase;
    } catch (error) {
      throw new CaseError.CaseCreateError(null, error);
    }
  }

  async fetchCases(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<Case>> {
    try {
      return await this.caseRepository.fetchCases(
        tenantId,
        paginatorOptions,
        sortingOptions,
        filteringOptions,
        tenantUser,
      );
    } catch (error) {
      throw new CaseError.CaseFetchError(null, error);
    }
  }

  /**
   * Trigger a notification to the User who opened the Case to notify him for the updated status
   *
   * @param {number} tenantId - The active tenant
   * @param {User} user - The User who opened the Case
   * @param {Case} _case - The Case which was  marked as closed
   * @returns {Promise<void>} - A simple promise to ensure that the action hs been dispatched successfully
   */
  private async notifyEmailCaseClosed(tenantId: number, user: User, _case: Case): Promise<void> {
    const userProfile = user.userProfile ?? (await this.userProfileService.get(tenantId, user.id));
    const hostName = UtilsHelper.getHostName(this.appConfig);

    await this.notify.emailCaseClosed({
      tenantId,
      email: user.email,
      firstName: userProfile.firstName,
      caseName: _case.subject,
      url: hostName,
    });
  }

  /**
   * Update a Case and send some notifications to its followers
   *
   * @param {number} tenantId - The Tenant to which the Case belongs
   * @param {string} id - The ID of the Case that we want to update
   * @param {UpdateCaseDto} updateCase - The new data which should be used to update the Case
   * @param {CaseUpdateOrigin} origin - Info where the request for the update comes from
   * @returns {Promise<CaseDto>} - The updated Case instance
   */
  async updateCase(
    tenantId: number,
    id: string,
    updateCase: UpdateCaseDto,
    origin: CaseUpdateOrigin = CaseUpdateOrigin.Internal,
  ): Promise<CaseDto> {
    try {
      const tenant = await this.tenantRepository.findOneWithRelations(tenantId);
      const storedCase: Case = await this.caseRepository.findOneById(tenantId, id);

      const obj = new Case({id, tenantId, ...updateCase});
      const updatedCase = await this.caseRepository.save(obj);
      const updatedCaseStatus = (await this.caseRepository.findOneById(tenantId, id)).status;
      if (
        storedCase &&
        updatedCase.statusId !== storedCase.statusId &&
        (updatedCaseStatus.name === CaseStatus.Closed || updatedCaseStatus.name === CaseStatus.Reopen)
      ) {
        const updatedCaseWithUserData: Case = await this.caseRepository.findOneById(tenantId, id);
        const followers = await this.caseFollowerService.findByCaseId(tenantId, id);

        if (followers) {
          const caseFollowers = followers.filter((follower) => {
            // Don't filter out the creator of the Case if the update comes from InFO
            if (origin === CaseUpdateOrigin.INFO) {
              return true;
            }

            return follower.userId !== updatedCaseWithUserData.tenantUser.user.id;
          });

          await this.processNotifications(caseFollowers, updatedCaseWithUserData, updatedCaseStatus);
          await this.processEmailNotifications(caseFollowers, updatedCaseWithUserData, updatedCaseStatus);
        }
        if (updatedCaseStatus.name === CaseStatus.Reopen) {
          await this.infoSystemCommandsService.sendCaseUpdated(tenant, updatedCase);
        }
      }
      return updatedCase;
    } catch (error) {
      throw new CaseError.CaseFetchError(null, error);
    }
  }

  /**
   * Process the email notification which have to be send to the provided list of CaseFollowers
   *
   * @param {CaseFollower[]} caseFollowers - List with all the potential recipients, users somehow associated with the Case
   * @param {Case} updatedCase - Info for the Case
   * @param {Status} updatedCaseStatus - Info for the new Status of the Case used to determined which type of Notification to be send
   */
  private async processEmailNotifications(
    caseFollowers: CaseFollower[],
    updatedCase: Case,
    updatedCaseStatus: Status,
  ): Promise<void> {
    caseFollowers.forEach(async (follower) => {
      if (follower.tenantUser.user.emailNotifications) {
        if (updatedCaseStatus.name === CaseStatus.Closed) {
          await this.notifyEmailCaseClosed(updatedCase.tenantUser.tenantId, updatedCase.tenantUser.user, updatedCase);
        }
      }
    });
  }

  /**
   * Process the notification which have to be send to the provided list of CaseFollowers
   *
   * @param {CaseFollower[]} caseFollowers - List with all the potential recipients, users somehow associated with the Case
   * @param {Case} updatedCase - Info for the Case
   * @param {Status} updatedCaseStatus - Info for the new Status of the Case used to determined which type of Notification to be send
   */
  private async processNotifications(
    caseFollowers: CaseFollower[],
    updatedCase: Case,
    updatedCaseStatus: Status,
  ): Promise<void> {
    const notifications: Notification[] = [];

    caseFollowers.forEach(async (follower) => {
      const newNotificationData: Partial<Notification> = {
        entityId: updatedCase.id,
        entityName: NotificationEntityName.Case,
        tenantId: updatedCase.tenantUser.tenantId,
        userId: follower.userId,
        isRead: false,
      };

      if (updatedCaseStatus.name === CaseStatus.Closed) {
        newNotificationData.type = NotificationTypeEnum.CaseClosed;
      } else if (updatedCaseStatus.name === CaseStatus.Reopen) {
        newNotificationData.type = NotificationTypeEnum.CaseReopen;
      }

      if (newNotificationData.type) {
        const newNotification = new Notification(newNotificationData);
        notifications.push(newNotification);
      }
    });

    await this.notificationService.saveMany(notifications);
  }

  async get(tenantId: number, id: string, userId: string): Promise<CaseDto> {
    try {
      await this.caseFollowerService.readCase(tenantId, id, userId);
      return this.caseRepository.findOneById(tenantId, id);
    } catch (error) {
      throw new CaseError.CaseFetchError(null, error);
    }
  }

  public async createFile(
    tenantId: number,
    userId: string,
    files: Express.Multer.File[],
    payload: any,
  ): Promise<CaseCommentDto> {
    try {
      const {caseId} = payload;
      const path: string = `case/${caseId}/file`;
      await this.fileService.uploadFiles(tenantId, userId, files, path, {entityId: caseId, entityName: Case.name});
      return this.caseRepository.findOneById(tenantId, caseId);
    } catch (error) {
      throw new CaseCommentError.CaseCommentCreateError(null, error);
    }
  }
}
