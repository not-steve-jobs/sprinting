import {Injectable} from '@nestjs/common';
import {Client} from '../../client/client.entity';
import {ClientProfile} from '../../clientProfile/clientProfile.entity';
import {CountryService} from '../../country/country.service';
import {TenantService} from '../../tenant/tenant.service';
import {
  AccountCreatedData,
  ContactCreatedData,
  GipEventWithExtendedProps,
  InfoSystemEvent,
} from '../infoSystem/eventModels';
import {InfoSystemError} from '../infoSystem/infoSystem.error';
import {v4 as uuid} from 'uuid';
import {Location} from '../../location/location.entity';
import {LocationStatusEnum} from '../../location/location.enum';
import {Logger} from '../../../core/logger';
import {getConnection} from 'typeorm';
import {LocationEventsService} from '../infoSystem/events/locationEvents.service';
import {LocationService} from '../../location/location.service';
import {IntegrationLogs} from '../integrationLogging.service';
import {IntegrationSystemLogType} from '../integrationSystem.enum';
import {User} from '../../user/user.entity';
import {UserProfile} from '../../userProfile/userProfile.entity';
import {UserEventsService} from '../infoSystem/events/userEvents.service';
import {TenantUser} from '../../tenantUser/tenantUser.entity';
import {CommonIntegrationError} from '../commonIntegration.error';
import {RoleService} from '../../role/role.service';
import {AuthRoles} from '../../../core/auth/authRoles';
import {StatusService} from '../../status/status.service';
import {UserStatus} from '../../status/status.enum';

@Injectable()
export class DataMigrationEventsService {
  public constructor(
    private readonly logger: Logger,
    private readonly countryService: CountryService,
    private readonly tenantService: TenantService,
    private readonly locationEventsService: LocationEventsService,
    private readonly locationService: LocationService,
    private readonly integrationLogs: IntegrationLogs,
    private readonly userEventsService: UserEventsService,
    private readonly roleService: RoleService,
    private readonly statusService: StatusService,
  ) {}

  public async onBulkCustomerCreated(bulkEvent: GipEventWithExtendedProps) {
    const country = await this.countryService.findOneByCode(bulkEvent.country);

    if (!country) {
      throw new InfoSystemError.CountryNotFound();
    }

    const tenants = await this.tenantService.findAllByCountryId(country.id);
    if (tenants.length == 0) {
      throw new InfoSystemError.CountryNotFound();
    }

    bulkEvent.receivedAt = new Date();
    const messages = bulkEvent?.parameters as InfoSystemEvent[];

    try {
      const clients = [];
      const clientProfiles = [];
      const locations = [];

      messages.forEach(async (message: InfoSystemEvent) => {
        const {
          locationName,
          vat,
          businessName,
          number,
          phone,
          phonePrefix,
          email,
          web,
          locationId,
          city,
          street,
          postalCode,
          country: countryName,
          state,
          isMainLocation,
          status,
        } = message.parameters;
        const clientId = uuid();
        const client = new Client({
          id: clientId,
          name: locationName,
          country: country,
          countryId: country.id,
        });
        const clientProfile = new ClientProfile({
          id: clientId,
          VAT: vat ?? null,
          businessName: businessName ?? locationName,
          number: number ?? null,
          phone: phone ?? null,
          phonePrefix: phonePrefix ? phonePrefix.replace(/\D/g, '') : null,
          email: email ?? null,
          web: web ?? null,
          countryId: country.id,
        });

        const location = new Location({
          clientId: clientId,
          id: locationId,
          city: city ?? null,
          locationName: locationName,
          number: number,
          street: street ?? null,
          zip: postalCode ?? null,
          country: countryName ?? null,
          state: state ?? null,
          isMainLocation: isMainLocation,
          status: status === 'Disabled' ? LocationStatusEnum.Disabled : LocationStatusEnum.Active,
        });
        clients.push(client);
        clientProfiles.push(clientProfile);
        locations.push(location);
      });

      await getConnection().transaction(async (tManager) => {
        await Promise.all([
          tManager.createQueryBuilder(Client, 'Client').insert().values(clients).execute(),
          tManager.createQueryBuilder(ClientProfile, 'ClientProfile').insert().values(clientProfiles).execute(),
          tManager.createQueryBuilder(Location, 'Location').insert().values(locations).execute(),
        ]);
      });
    } catch (err) {
      this.handleError(err, bulkEvent, (e: InfoSystemEvent<AccountCreatedData>) =>
        this.locationEventsService.onAccountCreated(e),
      );
    }
  }

  public async onBulkLocationCreated(bulkEvent: GipEventWithExtendedProps) {
    const country = await this.countryService.findOneByCode(bulkEvent.country);

    if (!country) {
      throw new InfoSystemError.CountryNotFound();
    }

    const tenants = await this.tenantService.findAllByCountryId(country.id);
    if (tenants.length == 0) {
      throw new InfoSystemError.CountryNotFound();
    }

    bulkEvent.receivedAt = new Date();
    const messages = bulkEvent?.parameters as InfoSystemEvent[];

    try {
      const locations = [];

      messages.forEach(async (message: InfoSystemEvent) => {
        const {
          parentLocationId,
          locationName,
          number,
          locationId,
          city,
          street,
          postalCode,
          country: countryName,
          state,
          isMainLocation,
          status,
        } = message.parameters;
        const parentLocation = await this.locationService.findOne(parentLocationId);
        const clientId = parentLocation.clientId;

        const location = new Location({
          clientId: clientId,
          id: locationId,
          city: city ?? null,
          locationName: locationName,
          number: number,
          street: street ?? null,
          zip: postalCode ?? null,
          country: countryName ?? null,
          state: state ?? null,
          isMainLocation: isMainLocation,
          status: status === 'Disabled' ? LocationStatusEnum.Disabled : LocationStatusEnum.Active,
        });
        locations.push(location);
      });

      await getConnection().transaction(async (tManager) => {
        await tManager.createQueryBuilder(Location, 'Location').insert().values(locations).execute();
      });
    } catch (err) {
      this.handleError(err, bulkEvent, (e: InfoSystemEvent<AccountCreatedData>) =>
        this.locationEventsService.onAccountCreated(e),
      );
    }
  }

  public async onBulkContactCreated(bulkEvent: GipEventWithExtendedProps) {
    this.integrationLogs.logMessageHandler(
      __filename,
      IntegrationSystemLogType.InfoSystemIntegration,
      'Contact Created',
      bulkEvent,
    );

    const tenant = await this.tenantService.getByBrandAndCountry(bulkEvent.brand, bulkEvent.country);
    if (!tenant) {
      throw new CommonIntegrationError.CountryBrandNotFound();
    }

    bulkEvent.receivedAt = new Date();
    const messages = bulkEvent?.parameters as InfoSystemEvent[];

    const role = await this.roleService.getRoleByName(AuthRoles.user);
    const status = await this.statusService.getStatusByName(tenant.id, UserStatus.NotInvited, User.name);

    const contacts = [];
    const contactProfiles = [];
    const tenantContacts = [];

    const processing = new Promise<void>((resolve) => {
      messages.forEach(async (message: InfoSystemEvent, msgIndex, msgArray) => {
        const {
          userId,
          email,
          firstName,
          lastName,
          deptId,
          deptFunctionId,
          customDepartment,
          title,
          mainLocation,
          phone,
          phonePrefix,
          otherPhone,
          phonePrefixOtherPhone,
        } = message.parameters;

        const parentLocation = await this.locationService.findOne(mainLocation);
        const clientId = parentLocation.clientId;

        const contact = new User({
          id: userId,
          clientId,
          email,
          emailNotifications: false,
        });

        const contactProfile = new UserProfile({
          id: userId,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          department: deptId ?? null,
          departmentFunction: deptFunctionId ?? null,
          customDepartment: customDepartment ?? null,
          title: title ?? null,
          mainLocationId: mainLocation,
          phone: phone ?? null,
          phonePrefix: phonePrefix ? phonePrefix.replace(/\D/g, '') : null,
          otherPhone: otherPhone ?? null,
          otherPhonePrefix: phonePrefixOtherPhone ?? null,
        });

        const tenantContact = new TenantUser({
          tenantId: tenant.id,
          userId: userId,
          roleId: role.id,
          statusId: status.id,
        });

        contacts.push(contact);
        contactProfiles.push(contactProfile);
        tenantContacts.push(tenantContact);

        if (msgIndex === msgArray.length - 1) resolve();
      });
    });

    processing.then(async () => {
      await getConnection()
        .transaction(async (tManager) => {
          await Promise.all([
            tManager.createQueryBuilder(User, 'User').insert().values(contacts).execute(),
            tManager.createQueryBuilder(UserProfile, 'UserProfile').insert().values(contactProfiles).execute(),
            tManager.createQueryBuilder(TenantUser, 'TenantUser').insert().values(tenantContacts).execute(),
          ]);
        })
        .catch(() => {
          this.handleError('bulkContactCreated error', bulkEvent, (e: InfoSystemEvent<ContactCreatedData>) =>
            this.userEventsService.onContactCreated(e),
          );
        });
    });
  }

  private async handleError(bulkErr: any, bulkEvent: InfoSystemEvent, eventHandler: any) {
    this.logger.error(__filename, 'InfoSystemIntegration Event: BulkMigrationError', {bulkErr, bulkEvent});

    let eventFailures = 0;
    const failedEventIds: string[] = [];
    await Promise.all(
      bulkEvent.parameters.map(async (event: InfoSystemEvent) => {
        try {
          await eventHandler(event);
        } catch (err) {
          failedEventIds.push(event.eventId);
          eventFailures++;
          //TODO: maybe we need to log error into Bus Message table
        }
      }),
    );

    this.logger.error(__filename, 'InfoSystemIntegration Event: BulkMigration Fallback error', {eventFailures});
  }
}
