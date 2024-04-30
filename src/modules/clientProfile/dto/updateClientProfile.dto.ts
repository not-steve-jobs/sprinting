import {IsOptional, IsString, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {UpsertLocationDto} from '../../location/dto/upsertLocation.dto';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateClientProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Business name',
    example: 'Coca Cola - US',
  })
  businessName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Number',
    example: '000000563',
  })
  number: string;

  @ValidateNested({each: true})
  @Type(() => UpsertLocationDto)
  userLocation: UpsertLocationDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Email address',
    example: 'cocacola-us-239@cocacola-us.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Clients phone number',
    example: '4984368183',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Clients phone number prefix',
    example: '352',
  })
  phonePrefix: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Web page url',
    example: 'cocacola-us.380.com',
  })
  web: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Client VAT',
    example: '532566',
  })
  VAT: string;
}
