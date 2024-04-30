import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsString, IsBoolean, IsEnum, IsNotEmpty, IsUUID, IsNumber} from 'class-validator';
import {LocationStatusEnum} from '../location.enum';

export class InfoUpsertLocationDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Location id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location name',
    example: 'Madrid Tech 1',
  })
  locationName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location street',
    example: 'Calle Orense',
  })
  street?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location street number',
    example: '69',
  })
  number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location city',
    example: 'Madrid',
  })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location state',
    example: 'Spain',
  })
  state?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location country',
    example: 'Spain',
  })
  country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location postal code',
    example: '38117',
  })
  zip?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Location latitude',
    example: 38.78548423,
  })
  lat?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Location longitude',
    example: -23.948327,
  })
  lng?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location timezone',
    example: 'America/Los_Angeles',
  })
  timezone?: string;

  @IsEnum(LocationStatusEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Location status',
    example: 'under-review',
  })
  status?: LocationStatusEnum;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Location disable flag',
    example: false,
  })
  disableLocation?: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Location disable flag',
    example: false,
  })
  isMainLocation?: boolean;
}
