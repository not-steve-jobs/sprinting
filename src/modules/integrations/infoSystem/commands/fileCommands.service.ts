import {CommonIntegrationError} from '../../commonIntegration.error';
import {Tenant} from './../../../tenant/tenant.entity';
import {InfoSystemCommand} from './../infoSystemIntegrationTypes';
import {Injectable} from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import {File} from '../../../file/file.entity';
import * as path from 'path';
import {UserProfileRepository} from '../../../userProfile/userProfile.repository';
import {BusMessage} from '../../../busMessage/busMessage.entity';
import {TenantService} from '../../../tenant/tenant.service';
import {FileService} from '../../../file/file.service';
import {InfoSystemError} from '../infoSystem.error';
import {MessageRecordType} from '../eventModels';
import {CaseComment} from 'src/modules/caseComment/caseComment.entity';
import {CaseCommentRepository} from 'src/modules/caseComment/caseComment.repository';
import {EntityNameInfoEnum} from '../eventModels/entityName.enum';

@Injectable()
export class FileCommandsService {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
    private readonly tenantService: TenantService,
    private readonly fileService: FileService,
    private readonly caseCommentRepository: CaseCommentRepository,
  ) {}

  public async getFileCommand(commandName: string, tenant: Tenant, fileEntity: File): Promise<InfoSystemCommand> {
    const fileNameAndExtension = fileEntity.fileName;
    const fileExtension = path.extname(fileNameAndExtension);
    const fileName = fileNameAndExtension.slice(0, -fileExtension.length);
    const userProfile = await this.userProfileRepository.findOne(fileEntity.userId);

    let entityId = fileEntity.entityId;
    if (fileEntity.entityName == CaseComment.name) {
      const caseComment = await this.caseCommentRepository.findOneById(tenant.id, entityId);
      entityId = caseComment.caseId;
    }

    return {
      commandName,
      commandId: uuid(),
      country: tenant.country?.code,
      brand: tenant.brand,
      parameters: {
        contactRecordType: MessageRecordType.Client,
        entityName: EntityNameInfoEnum[fileEntity.entityName],
        externalDocId: fileEntity.id,
        fileName: fileName,
        fileNameAndExtension: fileNameAndExtension,
        entityId: entityId,
        description: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : fileEntity.userName,
      },
    };
  }

  public async onCreateFileSuccess(busMessage: BusMessage, responseData: string) {
    const commandData = busMessage.payload;
    const tenant = await this.tenantService.getByBrandAndCountry(commandData.body.brand, commandData.body.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    try {
      await this.fileService.updateFileExternalId(tenant.id, commandData.body.parameters.infoDocId, responseData);
    } catch (error) {
      throw new InfoSystemError.FileNotExists();
    }
  }
}
