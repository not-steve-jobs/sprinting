import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {CloseReasonArguments} from '../closeReasonArguments.entity';

const internalTenantName: string = 'Adecco';

export class CloseReasonArgumentsDto {
  @ApiProperty({
    description: 'Name of user closed the job order',
    example: 'John Smith',
  })
  @IsOptional()
  closedBy: string;

  @ApiProperty({
    description: 'Tenant name',
    example: 'Adecco',
  })
  tenantName: string;

  @ApiProperty({
    description: 'Comment for closing the job order',
    example: 'The user is disabled',
  })
  @IsOptional()
  comment: string;

  @ApiProperty({
    description: 'Close date of job order',
    example: '2021-02-02 12:32:00',
  })
  closedOn: Date;

  @ApiProperty({
    description: 'ID of close reason',
    example: 79,
  })
  closeReasonId: number;

  @ApiProperty({
    description: 'Key name of the close reason',
    example: 'other',
  })
  keyName: string;

  @ApiProperty({
    description: 'Type of close reason',
    example: 'common',
  })
  type: string;

  constructor(data: CloseReasonArguments, isClosedFromCLA: boolean, tenantName: string) {
    //TODO: remove useless tenantName parameter when tenant relation is resolved (#2355)
    if (isClosedFromCLA) {
      this.tenantName = tenantName;
    } else {
      this.tenantName = internalTenantName;
    }
    this.closedBy = data.closedBy;
    this.comment = data.comment;
    this.closedOn = data.createdAt;
    this.closeReasonId = data.closeReason.id;
    this.keyName = data.closeReason.reason;
    this.type = data.closeReason.type;
  }
}
