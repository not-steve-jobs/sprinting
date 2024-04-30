import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class JobOrderAssociateStatusDto {
  @IsString()
  @ApiProperty({
    description: 'Status Name',
    example: 'offer',
  })
  public statusName: string;
}
