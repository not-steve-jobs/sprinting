import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsOptional} from 'class-validator';
import {BusMessageStatusEnum} from '../busMessage.enum';

export class UpdateBusMessageAttemptDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Attempt Status',
    example: 'success',
  })
  public status?: BusMessageStatusEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Attempt Internal Error during processing',
    example: 'Error',
  })
  public internalError?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Attempt FixedBy',
    example: 'Error',
  })
  public fixedBy?: string;
}
