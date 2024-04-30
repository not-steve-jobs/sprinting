import {PlainObject} from 'src/modules/common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsJSON, IsUUID, IsOptional} from 'class-validator';
import {BusMessageStatusEnum, BusMessageTypeEnum} from '../busMessage.enum';

export class UpdateBusMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Name',
    example: 'createContact',
  })
  public messageName: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Id',
    example: 'defface0-dd6f-4951-8229-e6c710067e95',
  })
  public messageId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Type',
    example: 'success',
  })
  public type: BusMessageTypeEnum;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Status',
    example: 'success',
  })
  public status?: BusMessageStatusEnum;

  @IsJSON()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Payload',
    example: '{}',
  })
  public payload?: PlainObject;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message Internal Error during processing',
    example: 'Error',
  })
  public internalError?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bus Message FixedBy',
    example: 'Error',
  })
  public fixedBy?: string;
}
