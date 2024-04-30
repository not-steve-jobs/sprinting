import {WorkplaceStatus} from './../workplace.enum';
import {IsUUID, IsOptional, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class WorkplaceCreateDto {
  @IsUUID()
  @ApiProperty({
    description: 'Workplace id which is location with some addition data',
    example: 'b945be10-4034-4160-a839-02f8bb2b51fe',
  })
  locationId: string;

  @ApiProperty({
    description: 'Parent location for this Workplace (one Location can have multiple Workplaces)',
    example: '00000000-0000-4000-0000-000000116000',
  })
  parentLocationId: string;

  @IsString()
  @ApiProperty({
    description: 'Workplace status',
    example: 'open',
  })
  status: WorkplaceStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Workplace work environment',
    example: '',
  })
  workEnvironment?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Name of Wifi network',
    example: 'testWIFI',
  })
  wifiId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Workplace QR data',
    example: '',
  })
  qrCode?: string;
}
