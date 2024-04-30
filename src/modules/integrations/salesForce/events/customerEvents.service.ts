import {CommonIntegrationError} from '../../commonIntegration.error';
import {Injectable} from '@nestjs/common';
import {ClientStatusEnum} from '../../../client/client.enum';
import {ClientService} from '../../../client/client.service';
import {SalesForceCreateClientDto} from '../../../client/dto/salesForceCreateClientDto';
import {Country} from '../../../country/country.entity';
import {CountryService} from '../../../country/country.service';
import {TenantService} from '../../../tenant/tenant.service';
import {CustomerCreatedData, SalesForceEvent} from '../eventModels';
import {CustomerUpdatedData} from '../eventModels/customerUpdatedData';
import {SalesForceError} from '../salesForce.error';
import {IntegrationSystemLogType} from '../../integrationSystem.enum';
import {IntegrationLogs} from '../../integrationLogging.service';
import {ClientStatus} from '../eventModels/salesForceStatuses.enum';

@Injectable()
export class CustomerEventsService {
  public constructor(
    private readonly countryService: CountryService,
    private readonly tenantService: TenantService,
    private readonly clientService: ClientService,
    private readonly integrationLogs: IntegrationLogs,
  ) {}

  public async onCustomerCreated(event: SalesForceEvent<CustomerCreatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Customer Created',
      event,
    );

    const country = await this.countryService.findOneByCode(event.country);

    if (!country) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    const tenants = await this.tenantService.findAllByCountryId(country.id);
    if (tenants.length == 0) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    let clientCountry: Country;
    if (event.parameters.countryCode) {
      clientCountry = await this.countryService.findOneByCode(event.parameters.countryCode);
      if (!clientCountry) {
        throw new CommonIntegrationError.CountryNotFound();
      }
    }

    const clientData: SalesForceCreateClientDto = {
      countryId: country.id,
      name: event.parameters.name,
      status: event.parameters.status === ClientStatus.Inactive ? ClientStatusEnum.Inactive : ClientStatusEnum.Active,
      clientInformation: {
        externalCustomerId: event.parameters.externalCustomerId ? event.parameters.externalCustomerId : null,
        businessName: event.parameters.name ? event.parameters.name : null,
        street: event.parameters.street ? event.parameters.street : null,
        street2: event.parameters.street2 ? event.parameters.street2 : null,
        city: event.parameters.city ? event.parameters.city : null,
        state: event.parameters.state ? event.parameters.state : null,
        zip: event.parameters.zip ? event.parameters.zip : null,
        countryId: clientCountry ? clientCountry.id : null,
        nationalAccountManager: event.parameters.nationalAccountManager
          ? event.parameters.nationalAccountManager
          : null,
        branchCostCenter: event.parameters.branchCostCenter ? event.parameters.branchCostCenter : null,
        customerType: event.parameters.customerType ? event.parameters.customerType : null,
        contractRequired: event.parameters.contractRequired ? event.parameters.contractRequired : null,
      },
    };

    await this.clientService.createFromSalesForce(clientData);
  }

  public async onCustomerUpdated(event: SalesForceEvent<CustomerUpdatedData>) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.SalesForceIntegration,
      'Customer Updated',
      event,
    );

    const country = await this.countryService.findOneByCode(event.country);

    if (!country) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    const tenants = await this.tenantService.findAllByCountryId(country.id);
    if (tenants.length == 0) {
      throw new CommonIntegrationError.CountryNotFound();
    }

    let client;
    if (event.parameters.externalCustomerId) {
      client = await this.clientService.findOneByExternalCustomerId(event.parameters.externalCustomerId);
      if (!client) {
        throw new SalesForceError.ClientNotFound();
      }
    } else {
      throw new SalesForceError.CustomerNotSpecified();
    }

    let clientCountry: Country;
    if (event.parameters.countryCode) {
      clientCountry = await this.countryService.findOneByCode(event.parameters.countryCode);
      if (!clientCountry) {
        throw new CommonIntegrationError.CountryNotFound();
      }
    }

    const clientData: SalesForceCreateClientDto = {
      countryId: country.id,
      name: event.parameters.name,
      status: event.parameters.status === ClientStatus.Inactive ? ClientStatusEnum.Inactive : ClientStatusEnum.Active,
      clientInformation: {
        externalCustomerId: event.parameters.externalCustomerId ? event.parameters.externalCustomerId : null,
        businessName: event.parameters.name ? event.parameters.name : null,
        street: event.parameters.street ? event.parameters.street : null,
        street2: event.parameters.street2 ? event.parameters.street2 : null,
        city: event.parameters.city ? event.parameters.city : null,
        state: event.parameters.state ? event.parameters.state : null,
        zip: event.parameters.zip ? event.parameters.zip : null,
        countryId: clientCountry ? clientCountry.id : null,
        nationalAccountManager: event.parameters.nationalAccountManager
          ? event.parameters.nationalAccountManager
          : null,
        branchCostCenter: event.parameters.branchCostCenter ? event.parameters.branchCostCenter : null,
        customerType: event.parameters.customerType ? event.parameters.customerType : null,
        contractRequired: event.parameters.contractRequired ? event.parameters.contractRequired : null,
      },
    };

    await this.clientService.updateFromSalesForce(client.id, clientData);
  }
}
