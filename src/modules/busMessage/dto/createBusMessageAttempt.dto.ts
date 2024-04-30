import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsUUID, IsOptional} from 'class-validator';
import {BusMessageStatusEnum} from '../busMessage.enum';

export class CreateBusMessageAttemptDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Id',
    example: 'defface0-dd6f-4951-8229-e6c710067e95',
  })
  public busMessageId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Status',
    example: 'sent',
  })
  public status: BusMessageStatusEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Attempt FixedBy',
    example: 'Error',
  })
  public fixedBy?: string;
}
