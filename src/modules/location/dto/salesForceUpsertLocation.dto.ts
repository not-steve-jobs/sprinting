import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsString, IsEnum, IsNotEmpty, IsUUID, IsNumber} from 'class-validator';
import {LocationStatusEnum} from '../location.enum';

export class SalesForceUpsertLocationDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Location id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Sales force location id',
    example: 'a4p5w000000IekhAAC',
  })
  externalLocationId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId?: string;

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
    description: 'Location city',
    example: 'Madrid',
  })
  city?: string;

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
    description: 'Location state',
    example: 'Spain',
  })
  state?: string;

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
    description: 'Location street',
    example: 'Calle Orense',
  })
  street2?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Location postal code',
    example: '38117',
  })
  zip?: string;

  @IsEnum(LocationStatusEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Location status',
    example: 'under-review',
  })
  status?: LocationStatusEnum;

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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Order owing office',
    example: '02001',
  })
  orderOwningOffice?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Employee owing office',
    example: '02001',
  })
  employeeOwningOffice?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Bill to external contact id',
    example: 'a4p5w000000IekhAAC',
  })
  billToExternalContactId?: string;
}
