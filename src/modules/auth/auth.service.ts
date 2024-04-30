import {Injectable} from '@nestjs/common';
import {UserStatus} from '../status/status.enum';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {UserRepository} from '../user/user.repository';
import {UserConsentService} from '../userConsent/userConsent.service';
import {AuthServiceErrors} from './auth.error';
import {AuthDto} from './dto/auth.dto';
import {User} from '../user/user.entity';
import {TenantUserInvitationService} from '../tenantUserInvitation/tenantUserInvitation.service';
import {StatusService} from '../status/status.service';
import {getConnection} from 'typeorm';
import {TenantUserInvitationRepository} from '../tenantUserInvitation/tenantUserInvitation.repository';
import {AuthArtifacts} from '../../core/auth/authArtifacts.interface';
import {RegisterUserRequestDto} from '../user/dto/registerUserRequest.dto';
import {TenantUserInvitation} from '../tenantUserInvitation/tenantUserInvitation.entity';
import {Tenant} from '../tenant/tenant.entity';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {InfoSystemCommandsService} from '../integrations/infoSystem/infoSystemCommands.service';
import {TenantRepository} from '../tenant/tenant.repository';
import {TenantUserLocationService} from '../tenantUserLocation/tenantUserLocation.service';
import {TenantUserPermissionService} from '../tenantUserPermission/tenantUserPermission.service';
import {TenantUserCacheService} from 'src/appCache/tenantUserCache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantUserRepository: TenantUserRepository,
    private readonly userConsentService: UserConsentService,
    private readonly tenantUserInvitationService: TenantUserInvitationService,
    private readonly statusService: StatusService,
    private readonly infoSystemCommandsService: InfoSystemCommandsService,
    private readonly tenantRepository: TenantRepository,
    private readonly tenantUserLocationService: TenantUserLocationService,
    private readonly tenantUserPermissionService: TenantUserPermissionService,
    private readonly tenantUserCache: TenantUserCacheService,
  ) {}

  async auth(tenant: Tenant, tenantUser: TenantUser): Promise<AuthDto> {
    if (tenantUser.status.name !== UserStatus.Active) {
      throw new AuthServiceErrors.AuthUserDisabledError({message: 'userDisabledError'});
    }

    if (tenantUser.user.inactive) {
      throw new AuthServiceErrors.AuthUserDisabledError({message: 'userInativeError'});
    }

    const unsignedConsentsP = this.userConsentService.check(tenantUser.tenantId, tenantUser.userId);

    // TODO: Perhaps the following block should be moved to the Auth Guard?
    if (tenantUser.activationDate === null || tenantUser.activationDate === undefined) {
      tenantUser.activationDate = new Date();
      const tenantUserToSave = new TenantUser({
        tenantId: tenantUser.tenantId,
        userId: tenantUser.userId,
        activationDate: tenantUser.activationDate,
      });
      await this.tenantUserRepository.save(tenantUserToSave);
      await this.tenantUserCache.set(tenantUser);
    }

    const authUser = new AuthDto(tenantUser);
    authUser.userWorksitesIds = tenantUser.tenantUserLocations.map((location) => location.locationId).sort();

    const unsignedConsents = await unsignedConsentsP;
    authUser.unsignedConsents = unsignedConsents;
    authUser.tenant = tenant;

    return authUser;
  }

  async register(tenantId: number, data: AuthArtifacts & RegisterUserRequestDto): Promise<User> {
    try {
      const invitation = await this.tenantUserInvitationService.verifyInvitation(
        tenantId,
        data.invitationId,
        data.userEmail,
      );

      const userInvitedP = this.userRepository.findOneByEmail(data.userEmail);
      const statusP = this.statusService.getStatusByName(tenantId, UserStatus.Active, User.name);
      const tenantP = this.tenantRepository.findOneWithRelations(tenantId);
      const locationsP = this.tenantUserLocationService.getUserLocations(tenantId, invitation.userId);
      const permissionsP = this.tenantUserPermissionService.getUserPermissions(tenantId, invitation.userId);

      const userInvited = await userInvitedP;
      const user = new User();
      user.id = invitation.userId;
      user.clientId = userInvited.clientId;
      user.email = userInvited.email;
      user.B2CId = data.B2CId;

      const status = await statusP;

      const [savedUser, updatedTenantUser] = await getConnection().transaction(async (tManager) => {
        const userRepo = tManager.getCustomRepository(UserRepository);
        const tenantUserRepo = tManager.getCustomRepository(TenantUserRepository);
        const invitationRepo = tManager.getCustomRepository(TenantUserInvitationRepository);

        const tenantUserToUpdate = new TenantUser({
          userId: user.id,
          tenantId: invitation.tenantId,
          statusId: status.id,
        });

        // Mark invitation as used
        const invitationToUpdate = new TenantUserInvitation({
          id: invitation.id,
          tenantId: invitation.tenantId,
          acceptedAt: new Date(),
          isActive: false,
        });

        const savedUser = await userRepo.save(user);
        const updatedTenantUser = await tenantUserRepo.save(tenantUserToUpdate);
        await invitationRepo.save(invitationToUpdate);

        return [savedUser, updatedTenantUser];
      });

      await this.userConsentService.acceptLatestUserConsent(updatedTenantUser);

      const [tenant, locations, permissions] = await Promise.all([tenantP, locationsP, permissionsP]);

      this.infoSystemCommandsService.sendPortalAccessUpdated(
        savedUser,
        locations,
        permissions,
        updatedTenantUser,
        tenant,
      );

      return savedUser;
    } catch (error) {
      throw new AuthServiceErrors.AuthRegisterError(null, error);
    }
  }

  async activate(tenantId: number, id: string, data: AuthArtifacts): Promise<TenantUser> {
    const invitation = await this.tenantUserInvitationService.verifyInvitationExpiration(tenantId, id);
    if (invitation.tenantUser.user.B2CId !== data.B2CId) {
      throw new AuthServiceErrors.AuthError({message: 'Authorization error'});
    }

    try {
      const statusP = this.statusService.getStatusByName(invitation.tenantId, UserStatus.Active, User.name);
      const tenantP = this.tenantRepository.findOneWithRelations(tenantId);
      const locationsP = this.tenantUserLocationService.getUserLocations(tenantId, invitation.userId);
      const permissionsP = this.tenantUserPermissionService.getUserPermissions(tenantId, invitation.userId);

      const [tenant, locations, permissions, status] = await Promise.all([tenantP, locationsP, permissionsP, statusP]);

      const invitationToUpdate = new TenantUserInvitation({
        ...invitation,
        acceptedAt: new Date(),
        isActive: false,
      });

      const tenantUserToUpdate = new TenantUser({
        tenantId: invitation.tenantId,
        userId: invitation.userId,
        statusId: status.id,
      });

      const tenantUserSaved = await getConnection().transaction(async (tManager) => {
        const tenantUserRepo = tManager.getCustomRepository(TenantUserRepository);
        const invitationRepo = tManager.getCustomRepository(TenantUserInvitationRepository);

        await invitationRepo.save(invitationToUpdate);
        const tenantUserSaved = await tenantUserRepo.save(tenantUserToUpdate);
        return tenantUserSaved;
      });

      this.infoSystemCommandsService.sendPortalAccessUpdated(
        tenantUserSaved.user,
        locations,
        permissions,
        tenantUserSaved,
        tenant,
      );

      return tenantUserSaved;
    } catch (error) {
      throw new AuthServiceErrors.AuthActivateError(null, error);
    }
  }
}
