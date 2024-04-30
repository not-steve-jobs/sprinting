import * as dateFns from 'date-fns';
import {FeatureConfigurationService} from './../featureConfiguration/featureConfiguration.service';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {FileRepository} from './file.repository';
import {File} from './file.entity';
import {CaseCommentError} from '../caseComment/caseComment.error';
import {CaseComment} from '../caseComment/caseComment.entity';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {JobOrderError} from '../jobOrder/jobOrder.error';
import {TenantRepository} from '../tenant/tenant.repository';
import {FileError} from './file.error';
import {v4 as uuid} from 'uuid';
import mime from 'mime-types';
import {UpdateFileDto} from './dto/updateFile.dto';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {PersonService} from '../person/person.service';
import {GetTenantDocumentDto} from '../person/dto/getTenantDocument.dto';
import {GetFilesDto} from './dto/getFiles.dto';

@Injectable()
export class FileService {
  // 1MB = 1048576 bytes (in binary).
  private oneMbInBytes = 1048576;

  constructor(
    private readonly fileRepository: FileRepository,
    private readonly personService: PersonService,
    //private readonly azureStorageHelper: AzureStorageHelper,
    @Inject(forwardRef(() => InfoSystemCommandsService))
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly tenantRepository: TenantRepository,
    private readonly featureConfiguration: FeatureConfigurationService,
  ) {}

  private async checkFeatureConfigUploadRules(tenantId: number, files: Express.Multer.File[]) {
    const {
      config: {supportedFileTypes, maxFileSizeInMB, maxNumberOfFiles},
    } = await this.featureConfiguration.getFeatureConfigurationByFeatureName(
      tenantId,
      FeatureConfigurationFeature.SupportedFileTypesForUpload,
    );

    if (files.length > maxNumberOfFiles) {
      throw new FileError.FileCreateMaxNumberOfFilesExceededError();
    }

    files.forEach((file) => {
      const fileExtension = mime.extension(file.mimetype);

      if (!supportedFileTypes.includes(fileExtension)) {
        throw new FileError.FileCreateUnsupportedFileTypeError();
      } else if (file.size / this.oneMbInBytes > maxFileSizeInMB) {
        throw new FileError.FileCreateMaxSizeExceededError();
      }
    });
  }

  async uploadFile(tenantId: number, file: Express.Multer.File): Promise<File> {
    const fileId = uuid();
    const path: string = `file/${fileId}`;

    try {
      await this.checkFeatureConfigUploadRules(tenantId, [file]);
    } catch (error) {
      throw new FileError.FileCreateError(null, error);
    }

    const blobPathAndName = `./${path}/${dateFns.getTime(new Date())}_${file.originalname.replace('-', '_')}`;
    let documentId: string;
    try {
      const fileResponse = await this.personService.uploadTenantDocument(tenantId, file, fileId);
      documentId = fileResponse.externalDocId;
    } catch (error) {
      throw new FileError.FileCreateError(null, error);
    }

    if (!documentId) {
      throw new FileError.FileCreateError(null);
    }

    const fileEntity = new File({
      id: documentId,
      tenantId: tenantId,
      filePathAndName: blobPathAndName,
    });

    return this.fileRepository.save(fileEntity);
  }

  async uploadFiles(
    tenantId: number,
    userId: string,
    files: Express.Multer.File[],
    path: string,
    payload?: any,
    addTimestampUniqueness = false,
  ): Promise<File[]> {
    const allUploadedFiles = [];

    try {
      await this.checkFeatureConfigUploadRules(tenantId, files);
    } catch (error) {
      throw new FileError.FileCreateError(null, error);
    }

    for (const file of files) {
      const blobPathAndName = `./${path}/${
        addTimestampUniqueness ? `${dateFns.getTime(new Date())}_` : ''
      }${file.originalname.replace('-', '_')}`;
      let documentId;
      try {
        const uploadedFile = await this.personService.uploadTenantDocument(tenantId, file, uuid());
        documentId = uploadedFile.externalDocId;
      } catch (error) {
        throw new FileError.FileCreateError(null, error);
      }

      if (!documentId) {
        throw new FileError.FileCreateError(null);
      }

      allUploadedFiles.push({
        blobPathAndName: blobPathAndName,
        fileId: documentId,
      });
    }

    const fileEntities = allUploadedFiles.map((uploadedFile) => {
      return new File({
        tenantId,
        userId,
        filePathAndName: uploadedFile.blobPathAndName,
        fileName: uploadedFile.blobPathAndName.split('/').pop(),
        id: uploadedFile.fileId,
        ...payload,
      });
    });

    const fileRepositorySavePromises = fileEntities.map((entity) => this.fileRepository.save(entity));
    const savedFiles = await Promise.all(fileRepositorySavePromises);
    const tenant = await this.tenantRepository.findOneWithRelations(tenantId);

    //send command for CaseComment file only
    //for Job and Case commands will be send on success command response
    if (payload.entityName == CaseComment.name) {
      const fileIntegrationCommandsPromises = fileEntities.map((entity) =>
        this.infoSystemCommandsService.sendDocumentCreated(tenant, entity),
      );

      await Promise.all(fileIntegrationCommandsPromises);
    }

    return savedFiles;
  }

  async getFileByName(tenantId: number, name: string): Promise<any> {
    const file = await this.fileRepository.findOneByFilePathAndName(tenantId, name);
    if (!file) {
      throw new FileError.FileMissingError(null);
    }

    if (file.personId) {
      return this.personService.getPersonalDocument(tenantId, file.personId, file.id);
    } else {
      return this.personService.getTenantDocument(tenantId, file.id);
    }
  }

  async getFileBlobById(tenantId: number, fileId: string): Promise<GetTenantDocumentDto> {
    const file = await this.fileRepository.findOne(tenantId, fileId);
    if (!file) {
      throw new FileError.FileMissingError(null);
    }
    if (file.personId) {
      return this.personService.getPersonalDocument(tenantId, file.personId, file.id);
    } else {
      return this.personService.getTenantDocument(tenantId, file.id);
    }
  }

  async getFile(tenantId: number, fileId: string): Promise<File> {
    return this.fileRepository.findOne(tenantId, fileId);
  }

  async fetchFilesByCaseId(tenantId: number, caseId: string): Promise<GetFilesDto> {
    try {
      const caseFiles = await this.fileRepository.findByCaseId(tenantId, caseId);
      const caseCommentFiles = await this.fileRepository.findCaseCommentFilesByCaseId(tenantId, caseId);
      const allFiles: GetFilesDto = {
        results: [...caseFiles[0], ...caseCommentFiles[0]],
        total: caseFiles[1] + caseCommentFiles[1],
      };
      return allFiles;
    } catch (error) {
      throw new CaseCommentError.CaseCommentFetchError(null, error);
    }
  }

  async fetchFilesByCaseCommentId(tenantId: number, caseCommentId: string): Promise<File[]> {
    try {
      return await this.fileRepository.findByCaseCommentId(tenantId, caseCommentId);
    } catch (error) {
      throw new CaseCommentError.CaseCommentFetchError(null, error);
    }
  }

  async updateFileExternalId(tenantId: number, fileId: string, externalId: string): Promise<File> {
    const file = await this.fileRepository.findOne(tenantId, fileId);
    if (!file) {
      throw new FileError.FileUpdateExternalIdError();
    }

    file.externalId = externalId;
    return this.fileRepository.save(file);
  }

  async createFileFromInfo(fileData: UpdateFileDto): Promise<File> {
    const file: File = new File({
      ...fileData,
    });

    file.filePathAndName = fileData.fileName;

    return this.fileRepository.save(file);
  }

  async deleteFile(tenantId: number, fileId: string, userId: string, isDraft = false): Promise<File> {
    const file = await this.fileRepository.findOne(tenantId, fileId);
    try {
      await this.personService.deleteTenantDocument(tenantId, fileId);
    } catch (error) {
      throw error;
    }
    if (isDraft) {
      const fileToDelete = new File({
        id: fileId,
        tenantId,
      });
      return this.fileRepository.delete(fileToDelete);
    }
    file.deletedByUserId = userId;
    //await this.infoSystemCommandsService.sendFileDeleted(tenant, file);
    return this.fileRepository.save(file);
  }

  async fetchFilesByJobOrderId(tenantId: number, jobOrderId: string, fetchDeletedFiles = false): Promise<File[]> {
    try {
      return await this.fileRepository.findByJobOrderId(tenantId, jobOrderId, fetchDeletedFiles);
    } catch (error) {
      throw new JobOrderError.JobOrderDoesNotExist(null, error);
    }
  }
}
