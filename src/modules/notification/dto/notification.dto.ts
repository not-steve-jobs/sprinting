import {ApiProperty} from '@nestjs/swagger';
import {Notification} from './../notification.entity';
import {NotificationTypeEnum} from './../notification.enum';

export class NotificationDto {
  @ApiProperty({
    description: 'The ID of the Notification',
    example: '00000000-0000-4000-0000-000000001163',
  })
  id: string;

  @ApiProperty({
    description: 'Job order tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'User id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  userId: string;

  @ApiProperty({
    description: 'Notification entity id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public entityId?: string;

  @ApiProperty({
    description: 'Notification entity name',
    example: 'Case',
  })
  public entityName?: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'newCaseMessage',
  })
  public type: NotificationTypeEnum;

  @ApiProperty({
    description: 'Notification read flag',
    example: true,
  })
  public isRead: boolean;

  @ApiProperty({
    description: 'Notification create date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Notification update date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;

  constructor(obj: Notification) {
    this.id = obj.id;
    this.tenantId = obj.tenantId;
    this.userId = obj.userId;
    this.entityId = obj.entityId ?? null;
    this.entityName = obj.entityName ?? null;
    this.type = obj.type;
    this.isRead = obj.isRead;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
