import {Injectable} from '@nestjs/common';
import {BlobDeleteIfExistsResponse, BlobServiceClient, BlockBlobClient, ContainerClient} from '@azure/storage-blob';
import {AppConfigService} from '../core/config/appConfig.service';
import {Logger} from '../core/logger';
import {AzureStorageHelperErrors} from './azure.storage.helper.error';

@Injectable()
export class AzureStorageHelper {
  public constructor(private readonly appConfig: AppConfigService, private readonly logger: Logger) {}

  public getBlobBlockClient = async (tenantId: number, filePathAndName: string): Promise<BlockBlobClient> => {
    return (await this.getContainerClient(tenantId)).getBlockBlobClient(filePathAndName);
  };

  public getClient = () =>
    BlobServiceClient.fromConnectionString(this.appConfig.azureStorageConfig.blobConnectionString);

  private getContainerClient = async (tenantId: number): Promise<ContainerClient> => {
    const containerName = `${this.appConfig.envPrefix}-tid${tenantId}`;
    let tenantContainer: ContainerClient;
    try {
      tenantContainer = this.getClient().getContainerClient(containerName);
      await tenantContainer.getProperties(); // will throw 404 if container doesn't exist
    } catch (e) {
      if (e.statusCode === 404) {
        tenantContainer = (await this.getClient().createContainer(containerName)).containerClient;
        await tenantContainer.setAccessPolicy('container');
        this.logger.info(__filename, `tenant blob container '${tenantContainer}' created`);
      } else {
        throw e;
      }
    }
    return tenantContainer;
  };

  public uploadFile = (file: any, tenantId: number, blobPathAndName: string) => {
    return this.getBlobBlockClient(tenantId, blobPathAndName)
      .then((client) => {
        return client.uploadData((file as any).buffer);
      })
      .then((response) => {
        this.logger.info(
          __filename,
          `Uploaded block blob ${blobPathAndName} successfully where tenantId = ${tenantId} requestId = ${response.requestId}`,
        );
        return response;
      })
      .catch((e) => {
        throw new AzureStorageHelperErrors.FileUploadError(
          {tenantId, filename: (file as any).originalname.replace('-', '_')},
          e,
        );
      });
  };

  public deleteFile = async (tenantId: number, filePathAndName: string): Promise<BlobDeleteIfExistsResponse> => {
    const blob = await this.getBlobBlockClient(tenantId, filePathAndName);
    return blob.deleteIfExists();
  };
}
