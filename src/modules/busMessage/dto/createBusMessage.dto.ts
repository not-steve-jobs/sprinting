import {PlainObject} from 'src/modules/common/common.dto';
import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsUUID, IsJSON} from 'class-validator';
import {
  BusMessageDirectionEnum,
  BusMessageScopeEnum,
  BusMessageStatusEnum,
  BusMessageTypeEnum,
} from '../busMessage.enum';

export class CreateBusMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Scope',
    example: 'info | taskmanagement',
  })
  public scope: BusMessageScopeEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Direction',
    example: 'inbound | outbound',
  })
  public direction: BusMessageDirectionEnum;

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

  @IsJSON()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Payload',
    example: '{}',
  })
  public payload: PlainObject;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bus Message Status',
    example: 'sent',
  })
  public status: BusMessageStatusEnum;
}
