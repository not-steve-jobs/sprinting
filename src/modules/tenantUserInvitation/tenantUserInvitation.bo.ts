import {Logger} from './../../core/logger';
import {Injectable} from '@nestjs/common';
import {TenantUserInvitationRepository} from './tenantUserInvitation.repository';
import {StatusService} from '../status/status.service';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {TenantUserRepository} from '../tenantUser/tenantUser.repository';
import {UserStatus} from '../status/status.enum';
import {User} from '../user/user.entity';
import {getCustomRepository} from 'typeorm';
import {StatusRepository} from '../status/status.repository';
import {UserService} from '../user/user.service';

@Injectable()
export class TenantUserInvitationBo {
  constructor(
    private readonly tenantUserInvitationRepository: TenantUserInvitationRepository,
    private readonly statusService: StatusService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  public async checkExpiration(tenantId: number): Promise<void> {
    const currentDate = new Date();

    const invitedStatus = await this.statusService.getStatusByName(tenantId, UserStatus.Invited, User.name);
    if (!invitedStatus) {
      this.logger.error(__filename, `Missing \"Invited\" status for tenant ${tenantId}`);
      return new Promise((res) => res);
    }
    const invitations = await this.tenantUserInvitationRepository.getExpiredInvitations(currentDate, invitedStatus.id);

    invitations.forEach((invitation) => this.processExpiration(invitation));
  }

  public async processExpiration(invitation: any): Promise<void> {
    const {tenantId, userId} = invitation;

    const tenantUserRepository = getCustomRepository(TenantUserRepository);
    const statusRepository = getCustomRepository(StatusRepository);
    const tenantUserInvitationRepository = getCustomRepository(TenantUserInvitationRepository);

    const status = await statusRepository.findOne(tenantId, UserStatus.InvitationExpired, User.name);

    const invitedTenantUserToCreate = new TenantUser({
      tenantId,
      userId: userId,
      statusId: status.id,
    });
    await tenantUserRepository.save(invitedTenantUserToCreate);
    invitation.isActive = false;
    await tenantUserInvitationRepository.save(invitation);
    await this.userService.prepareUpdatePortalAccessCommand(tenantId, invitation.userId);
  }
}
