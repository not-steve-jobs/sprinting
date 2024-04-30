import {Injectable} from '@nestjs/common';
import {Contract} from './contract.entity';
import {ContractRepository} from './contract.repository';
import {ContractDto} from './dto/contract.dto';
import {ExportHelper, GenerateXlsxDto} from '../../helpers/export.helper';
import {Pagination, PaginationOptions, SortingOptions, FilteringOptions} from './../common/paginate';
import {ContractError} from './contract.error';
import {UserService} from '../user/user.service';
import {BackgroundNotificationService} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.service';
import {ContractToBeSignedNotification} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/contractToBeSignedNotification.interface';
import {logger} from '@azure/storage-blob';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {GenerateXlsxOptions} from 'src/core/generateXlsxOptions.interface';
import {ContractsXlsxDto, ContractXlsxDto} from './dto/contractXlsx.dto';
import {XlsxTemplateNames} from 'src/core/xlsxTemplateNames.enum';
import * as dateFns from 'date-fns';

@Injectable()
export class ContractService {
  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly exportHelper: ExportHelper,
    private readonly userService: UserService,
    private readonly notify: BackgroundNotificationService,
  ) {}

  async fetchContracts(
    tenantId: number,
    paginatorOptions: PaginationOptions,
    sortingOptions: SortingOptions,
    filteringOptions: FilteringOptions,
    tenantUser: TenantUser,
  ): Promise<Pagination<Contract>> {
    try {
      return await this.contractRepository.fetchContracts(
        tenantId,
        paginatorOptions,
        sortingOptions,
        filteringOptions,
        tenantUser,
      );
    } catch (error) {
      throw new ContractError.ContractsFetchError(null, error);
    }
  }

  async get(tenantId: number, contractId: string): Promise<ContractDto> {
    return new ContractDto(await this.contractRepository.findOne(tenantId, contractId));
  }

  async create(tenantId: number, upsertContract: ContractDto): Promise<ContractDto> {
    try {
      const contractToSave = new Contract();
      Object.assign(contractToSave, upsertContract);
      const contractSaved = new ContractDto(await this.contractRepository.save(contractToSave));

      await this.sendContractToBeSignedNotification(
        tenantId,
        contractSaved.locationId,
        contractSaved.number,
        contractSaved.dateStart.toString(),
        contractSaved.dateEnd.toString(),
        contractSaved.createdAt.toString(),
      );
      return contractSaved as ContractDto;
    } catch (error) {
      logger.error('contract creation error', upsertContract);
    }
  }

  public async sendContractToBeSignedNotification(
    tenantId: number,
    locationId: string,
    contractNumber: string,
    contractDateStart: string,
    contractDateEnd: string,
    contractCreatedAt: string,
  ) {
    const hasNotificationEnabled = true;
    const permissionRequired = 'contracts';
    const usersWithPermissions = await this.userService.findUsersWithPermission(
      tenantId,
      permissionRequired,
      locationId,
      hasNotificationEnabled,
    );

    const emailsToNotify = usersWithPermissions.filter((user) => user.emailNotifications).map((user) => user.email);
    const emailNotificationMsg: ContractToBeSignedNotification = {
      dateStart: contractDateStart,
      dateEnd: contractDateEnd,
      contractNumber: contractNumber,
      createdAt: contractCreatedAt,
      tenantId: tenantId,
      emailList: emailsToNotify,
    };

    await this.notify.emailContractToBeSigned(emailNotificationMsg);
  }

  public async generateXlsx(options: GenerateXlsxOptions): Promise<GenerateXlsxDto> {
    const {tenantId, entityIds} = options;
    const relations = ['status', 'location', 'type'];

    try {
      const contractsData = await this.contractRepository.findManyByIds(tenantId, entityIds, relations);
      const contractsXlsxData = this.generateContractXlsxData(contractsData);

      switch (options.tenantId) {
        case 110:
          return await this.exportHelper.generateXlsx(contractsXlsxData, XlsxTemplateNames.ContractsLux);
        default:
          return await this.exportHelper.generateXlsx(contractsXlsxData, XlsxTemplateNames.ContractsPol);
      }
    } catch (error) {
      throw new ContractError.ContractsExportError(null, error);
    }
  }

  /**
   * Generates the data that the XLSX file will contain.
   *
   * @param {Array<Contract>} contractsData - Records from Contract repository.
   * @returns {ContractsXlsxDto} - The data that will be included in the XLSX file.
   */
  private generateContractXlsxData(contractsData: Contract[]): ContractsXlsxDto {
    const dateFormatLong = 'PPPPp';
    const dateFormatShort = 'dd MMM yyyy';
    const title = `Contracts report - ${dateFns.format(new Date(), dateFormatLong)}`;
    const data = contractsData.map(
      (data): ContractXlsxDto => {
        return {
          associateName: data.associateName ?? '',
          number: data.number ?? '',
          location: data.location?.locationName ?? '',
          dateStart: dateFns.format(data.dateStart, dateFormatShort) ?? '',
          dateEnd: dateFns.format(data.dateEnd, dateFormatShort) ?? '',
          status: data.status?.name ?? '',
          type: data.type?.name ?? '',
          service: data.service ?? '',
          signatureDate: dateFns.format(data.signatureDate, dateFormatShort) ?? '',
        };
      },
    );

    return {title, data};
  }
}
