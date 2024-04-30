import {ApiProperty} from '@nestjs/swagger';

export class CreateCaseFollowerDto {
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
}
