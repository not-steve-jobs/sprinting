import {Controller, Body, Post, Param, Headers, ParseIntPipe, Put, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ListingDto} from '../common/listing.dto';
import {MMMHubEmailCallbackDto, VerificationMessageDto} from './dto/mmmHubEmailCallback.dto';
import {NotificationService} from './notification.service';
import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {Notification} from './notification.entity';
import {Pagination} from '../common/paginate';
import {ContextService} from 'src/core/context/context.service';
import {Logger} from '../../core/logger';
import {SharedErrors} from '../../core/error/shared.error';

const SIGNATURE_HEADER = 'x-sfmc-ens-signature';

@ApiTags('Notification')
@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly contextService: ContextService,
    private readonly logger: Logger,
  ) {}

  // CHECK
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving notifications'})
  @Post('/tenant/:tenantId/notifications')
  public async fetch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() payload: ListingDto,
  ): Promise<Pagination<Notification>> {
    return this.notificationService.fetchNotifications(
      tenantId,
      {
        page: payload.page,
        itemsPerPage: payload.itemsPerPage,
      },
      this.contextService.userContext.id,
    );
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for setting a notification as read'})
  @Post('/tenant/:tenantId/notifications/:notificationId/read')
  public async readNotification(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ): Promise<Notification> {
    return this.notificationService.readNotification(tenantId, notificationId);
  }

  // CHECK
  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for set all user notifications as read'})
  @Put('/tenant/:tenantId/notifications/read-all')
  public async readAllUserNotification(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<{allNotificationsRead: boolean}> {
    return this.notificationService.readAllUserNotification(tenantId, this.contextService.userContext.id);
  }

  @ApiOperation({summary: 'Provide a webhook endpoint for MMM Hub'})
  @Post('/notifications/mmm-hub-event-callback')
  public async mmmHubEventCallback(
    @Body() payload: MMMHubEmailCallbackDto[] | VerificationMessageDto,
    @Headers(SIGNATURE_HEADER) header: string,
  ) {
    if ('callbackId' in payload && 'verificationKey' in payload) {
      this.logger.info(__filename, 'Verification message', payload);
    } else {
      if (!this.notificationService.verifyMMMHubSignature(header, payload)) {
        throw new SharedErrors.BadRequestError();
      }
      for (const eventData of payload) {
        this.notificationService.proceedEmailEvent(eventData);
      }
    }
  }
}
