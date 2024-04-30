import {SalesForceCommandsService} from './../integrations/salesForce/salesForceCommands.service';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import * as dateFns from 'date-fns';
import {SharedErrors} from '../../core/error/shared.error';
import {TenantUserInvitationRepository} from './tenantUserInvitation.repository';
import {TenantUserInvitation} from './tenantUserInvitation.entity';
import {TenantUserInvitationDto} from './dto/tenantUserInvitation.dto';
import {TenantUserInvitationServiceErrors} from './tenantUserInvitation.error';
import {FeatureConfigurationService} from '../featureConfiguration/featureConfiguration.service';
import {StatusService} from '../status/status.service';
import {FeatureConfigurationErrors} from '../featureConfiguration/featureConfiguration.error';
import {FeatureConfigurationFeature} from '../featureConfiguration/enum/featureConfigurationFeature.enum';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {RoleService} from '../role/role.service';
import {AuthRoles} from '../../core/auth/authRoles';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {v4 as uuid} from 'uuid';
import {UserStatus} from '../status/status.enum';
import {User} from '../user/user.entity';
import {BackgroundNotificationService} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.service';
import {TenantRepository} from '../tenant/tenant.repository';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {TenantUserLocationService} from '../tenantUserLocation/tenantUserLocation.service';
import {TenantUserPermissionService} from '../tenantUserPermission/tenantUserPermission.service';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';
import {UserInvitationNotification} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/userInvitationNotification.interface';
import {UserProfileRepository} from '../userProfile/userProfile.repository';
import {UserProfileDto} from '../userProfile/dto/userProfile.dto';
import {AdminInvitationNotification} from '../sendBackgroundNotification/backgroundNotification/backgroundNotificationEvents/adminInvitationNotification.interface';
import {UserRepository} from '../user/user.repository';
import {Logger} from 'src/core/logger';
import {UserService} from '../user/user.service';

@Injectable()
export class TenantUserInvitationService {
  constructor(
    private readonly logger: Logger,
    private readonly tenantUserInvitationRepository: TenantUserInvitationRepository,
    private readonly featureConfigurationService: FeatureConfigurationService,
    private readonly statusService: StatusService,
    private readonly roleService: RoleService,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly notify: BackgroundNotificationService,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly tenantUserLocationService: TenantUserLocationService,
    private readonly tenantUserPermissionService: TenantUserPermissionService,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
    @Inject(forwardRef(() => SalesForceCommandsService))
    private readonly salesForceCommandsService: SalesForceCommandsService,
  ) {}

  public async getOneIfActive(tenantId: number, id: string): Promise<TenantUserInvitationDto> {
    const item = await this.tenantUserInvitationRepository.findOneIfActive(tenantId, id);
    if (!item) {
      throw new SharedErrors.EntityNotFoundError({name: FeatureConfigurationFeature.Invitation, id: id});
    }

    return item;
  }

  public async findLastOneByEmail(tenantId: number, userId: string, email: string): Promise<TenantUserInvitationDto> {
    return this.tenantUserInvitationRepository.findLastOneByEmail(tenantId, userId, email);
  }

  public async create(
    tenantId: number,
    userId: string,
    createPortalAccessCommand = false,
    roleId?: number,
    invitedByUserId?: string,
  ): Promise<TenantUserInvitationDto> {
    this.logger.info(__filename, `Creating user ${userId} on tenant ${tenantId} invited by ${invitedByUserId}`);
    const tenantUserInvited = await this.tenantUserRepository.findOne(tenantId, userId);
    if (tenantUserInvited?.status) {
      delete tenantUserInvited.status;
    }
    if (!tenantUserInvited) {
      throw new TenantUserInvitationServiceErrors.InvitationUserNotExistsError({id: userId});
    }

    const activeInvitation = await this.tenantUserInvitationRepository.findLastOne(tenantId, userId);
    if (activeInvitation?.isActive && dateFns.isAfter(activeInvitation.dateExpiry, new Date())) {
      throw new TenantUserInvitationServiceErrors.InvitationEmailAlreadyActiveError({email: activeInvitation.email});
    }

    const invitationFeature = await this.featureConfigurationService.getFeatureConfigurationByFeatureName(
      tenantId,
      FeatureConfigurationFeature.Invitation,
    );

    if (invitationFeature && invitationFeature.config.daysValid) {
      const dateExpiry = dateFns.addDays(new Date(), invitationFeature.config.daysValid);

      const invitationId = uuid();

      const tenant = await this.tenantRepository.findOneWithRelations(tenantUserInvited.tenantId);
      const invitationUrl = tenant.domain.replace('invitationId', invitationId);

      const invitationData = new TenantUserInvitation({
        id: invitationId,
        tenantId,
        userId,
        email: tenantUserInvited.user.email,
        invitationLink: invitationUrl,
        dateExpiry,
        language: tenantUserInvited.user.userProfile.language,
      });

      this.logger.info(__filename, 'Persist user invitation data.');
      const tenantUserInvitation = await this.tenantUserInvitationRepository.save(invitationData);

      const status = await this.statusService.getStatusByName(tenantId, UserStatus.Invited, User.name);
      const role = roleId
        ? await this.roleService.getRoleById(roleId)
        : await this.roleService.getRoleByName(AuthRoles.user);
      tenantUserInvited.statusId = status.id;
      tenantUserInvited.disableReason = null;
      tenantUserInvited.otherDisableReason = null;
      const tenantUserToInvite = new TenantUser({
        tenantId: tenantUserInvited.tenantId,
        userId: tenantUserInvited.userId,
        statusId: tenantUserInvited.statusId,
        roleId: role.id,
        disableReason: null,
        otherDisableReason: null,
      });
      const savedTenantUser = await this.tenantUserRepository.save(tenantUserToInvite);
      await this.dataProvidingEventsService.sendTenantUserCreated(savedTenantUser);

      const {
        email,
        userProfile: {firstName, lastName, title},
      } = tenantUserInvited.user;

      const invitedByUserProfile: UserProfileDto = await this.userProfileRepository.findOneWithUser(invitedByUserId);
      const invitedByUserFullName = invitedByUserProfile
        ? `${invitedByUserProfile.title} ${invitedByUserProfile.firstName} ${invitedByUserProfile.lastName}`
        : 'Admin';

      if (role.name === AuthRoles.admin) {
        const adminInvitationNotification: AdminInvitationNotification = {
          tenantId: tenantId,
          name: `${title} ${firstName} ${lastName}`,
          email: email,
          firstName: firstName,
          link: invitationData.invitationLink,
        };
        this.logger.info(__filename, 'Add admin invitation data to email queue.');
        await this.notify.emailAdminInvitation(adminInvitationNotification);
      } else if (role.name === AuthRoles.user) {
        const userInvitationNotification: UserInvitationNotification = {
          tenantId: tenantId,
          name: `${title} ${firstName} ${lastName}`,
          email: email,
          userFirstName: firstName,
          adminFullName: invitedByUserFullName,
          link: invitationData.invitationLink,
        };
        this.logger.info(__filename, 'Add user invitation data to email queue.');
        await this.notify.emailUserInvitation(userInvitationNotification);
      }

      const locations = await this.tenantUserLocationService.getUserLocations(tenantId, tenantUserInvited.userId);
      const permissions = await this.tenantUserPermissionService.getUserPermissions(tenantId, tenantUserInvited.userId);
      if (createPortalAccessCommand) {
        this.infoSystemCommandsService.sendPortalAccessCreated(
          tenantUserInvited.user,
          locations,
          permissions,
          tenantUserToInvite,
          tenant,
        );
      } else {
        this.infoSystemCommandsService.sendPortalAccessUpdated(
          tenantUserInvited.user,
          locations,
          permissions,
          tenantUserToInvite,
          tenant,
        );

        // send 'updateContact' command to NAM
        this.salesForceCommandsService.sendContactUpdatedWithoutRelations(tenant, tenantUserInvited.userId);
      }

      return tenantUserInvitation;
    } else {
      throw new FeatureConfigurationErrors.FeatureConfigurationNotExistsError({
        feature: FeatureConfigurationFeature.Invitation,
      });
    }
  }

  //todo: check to delete
  public async verifyInvitation(tenantId: number, id: string, email: string): Promise<TenantUserInvitationDto> {
    const invitation = await this.tenantUserInvitationRepository.findOne(id);
    if (!invitation) {
      throw new SharedErrors.EntityNotFoundError({name: 'TenantUserInvitation', id: id});
    }

    if (invitation.acceptedAt) {
      throw new TenantUserInvitationServiceErrors.InvitationAlreadyUsedError({id: id});
    }

    if (invitation.email !== email) {
      throw new TenantUserInvitationServiceErrors.InvitationEmailValidationFailedError({id: id});
    }

    return invitation;
  }

  public async verifyInvitationExpiration(tenantId: number, id: string): Promise<TenantUserInvitationDto> {
    const invitation = await this.getOneIfActive(tenantId, id);

    if (!invitation) {
      throw new SharedErrors.EntityNotFoundError({name: 'TenantUserInvitation', id: id});
    }

    if (dateFns.isBefore(invitation.dateExpiry, new Date())) {
      throw new TenantUserInvitationServiceErrors.InvitationExpiredError({id: id});
    }

    return invitation;
  }

  public async update(invitation: TenantUserInvitation): Promise<TenantUserInvitationDto> {
    return this.tenantUserInvitationRepository.save(invitation);
  }

  /**
   * Change the Status of an invited user and disable the invitation link
   *
   * @param {number} tenantId - The Tenant ID of the invited user
   * @param {string} email - The email used in the invitation of the user
   */
  public async discardInvitation(tenantId: number, email: string): Promise<void> {
    // First disable the invitation so it can't be used anymore
    const user = await this.userRepository.findOneByEmail(email);
    const tenantUserInvitation = await this.tenantUserInvitationRepository.findLastOneByEmail(tenantId, user.id, email);

    tenantUserInvitation.isActive = false;
    this.update(tenantUserInvitation);

    // Then update the Status of the user so we can show that the invitation failed
    const tenantUser = await this.tenantUserRepository.findOne(tenantId, user.id);
    const invitationFailedStatus = await this.statusService.getStatusByName(
      tenantId,
      UserStatus.InvitationFailure,
      'User',
    );

    if (tenantUser && invitationFailedStatus) {
      tenantUser.statusId = invitationFailedStatus.id;
      await this.tenantUserRepository.save(
        new TenantUser({tenantId: tenantUser.tenantId, userId: user.id, statusId: tenantUser.statusId}),
      );
      await this.userService.prepareUpdatePortalAccessCommand(tenantId, user.id);
    }
  }
}
