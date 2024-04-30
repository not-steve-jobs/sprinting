import {Injectable} from '@nestjs/common';
import {ClientProfile} from 'src/modules/clientProfile/clientProfile.entity';
import {Tenant} from 'src/modules/tenant/tenant.entity';
import {v4 as uuid} from 'uuid';
import {SalesForceCommands, SalesForceCommandWithParameters} from '../salesForceIntegrationTypes';

@Injectable()
export class CustomerCommandsService {
  public async getUpdateCustomerCommand(
    tenant: Tenant,
    clientProfile: ClientProfile,
  ): Promise<SalesForceCommandWithParameters> {
    return {
      commandName: SalesForceCommands.updateCustomer,
      commandId: uuid(),
      brand: tenant.brand,
      country: tenant.country.code,
      parameters: {
        externalCustomerId: clientProfile.externalCustomerId,
        name: clientProfile.businessName,
        street: clientProfile.street,
        street2: clientProfile.street2,
        city: clientProfile.city,
        state: clientProfile.state,
        zip: clientProfile.zip,
        countryCode: tenant.country.code,
      },
    };
  }
}
