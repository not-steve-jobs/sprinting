import {ApiProperty} from '@nestjs/swagger';
import {CaseFollower} from './../caseFollower.entity';

export class CaseFollowerDto {
  @ApiProperty({
    description: 'Case follower id',
    example: '52748b69-728b-4db9-8b69-37c759c63e70',
  })
  public id: string;

  @ApiProperty({
    description: 'Case follower tenant id',
    example: 110,
  })
  public tenantId: number;

  @ApiProperty({
    description: 'Case follower user id',
    example: '21fd328d-b8ed-4f51-bbac-499daf4271f3',
  })
  public userId: string;

  @ApiProperty({
    description: 'Case id',
    example: 'defface0-dd6f-4951-8229-e6c710067e95',
  })
  public caseId: string;

  @ApiProperty({
    description: 'Case follower read flag',
    example: true,
  })
  public isCaseRead: boolean;

  @ApiProperty({
    description: 'Case follower user follower flag',
    example: false,
  })
  public isUserFollower: boolean;

  @ApiProperty({
    description: 'Case create date',
    example: '2021-02-22 22:56:41',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Case update date',
    example: '2021-02-22 22:56:41',
  })
  public updatedAt: Date;

  constructor(obj: CaseFollower) {
    this.id = obj.id;
    this.tenantId = obj.tenantId;
    this.userId = obj.userId;
    this.caseId = obj.caseId;
    this.isCaseRead = obj.isCaseRead;
    this.isUserFollower = obj.isUserFollower;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
