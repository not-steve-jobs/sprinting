import {IntegrationLogs} from './../../integrationLogging.service';
import {CommonIntegrationError} from '../../commonIntegration.error';
import {Injectable} from '@nestjs/common';
import {DocumentCreatedData, InfoSystemEvent, PersonalDocumentCreatedData} from '../eventModels';
import {TenantService} from '../../../tenant/tenant.service';
import {UpdateFileDto} from '../../../file/dto/updateFile.dto';
import {FileService} from '../../../file/file.service';
import {InfoEntityNameEnum} from '../eventModels/entityName.enum';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';

@Injectable()
export class FileEventsService {
  public constructor(
    private readonly tenantService: TenantService,
    private readonly fileService: FileService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async onDocumentCreated(event: InfoSystemEvent<DocumentCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'File Created',
      event,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const fileData: UpdateFileDto = {
      id: event.parameters.externalDocId,
      tenantId: tenant.id,
      fileName: `${event.parameters.fileName}.${event.parameters.fileExtension}`,
      entityId: event.parameters.entityId,
      entityName: InfoEntityNameEnum[event.parameters.entityName],
      description: event.parameters.description,
      externalId: event.parameters.infoDocId,
      userId: event.parameters.contactId,
    };
    await this.fileService.createFileFromInfo(fileData);
  }

  public async onPersonalDocumentCreated(event: InfoSystemEvent<PersonalDocumentCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Personal File Created',
      event,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(event.brand, event.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    const fileData: UpdateFileDto = {
      id: event.parameters.externalDocId,
      tenantId: tenant.id,
      fileName: `${event.parameters.fileName}.${event.parameters.fileExtension}`,
      entityId: event.parameters.entityId,
      entityName: InfoEntityNameEnum[event.parameters.entityName],
      description: event.parameters.description,
      externalId: event.parameters.externalDocId,
      personId: event.parameters.contactId,
    };
    await this.fileService.createFileFromInfo(fileData);
  }
}
