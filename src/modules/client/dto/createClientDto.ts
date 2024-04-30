import {IsEmail, IsString, ValidateNested, IsUUID, IsOptional} from 'class-validator';
import {Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {ClientStatusEnum} from '../client.enum';

class CreateClientInformationDto {
  @IsString()
  @ApiProperty({
    description: 'Client business name',
    example: 'Coca Cola - LU',
  })
  businessName: string;

  @IsString()
  @ApiProperty({
    description: 'Client number',
    example: '1',
  })
  number: string;

  @IsEmail()
  @ApiProperty({
    description: 'Client email address',
    example: 'client@@adeccogroup.com',
  })
  email: string;

  @ApiProperty({
    description: 'Clients phone number prefix',
    example: '352',
  })
  phonePrefix: string;

  @IsString()
  @ApiProperty({
    description: 'Client phone',
    example: '2904460165',
  })
  phone: string;

  @IsString()
  @ApiProperty({
    description: 'Client web address',
    example: 'cocacola-lu.2.com',
  })
  web: string;

  @IsString()
  @ApiProperty({
    description: 'Client VAT',
    example: '',
  })
  VAT: string;
}

export class CreateClientDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Client ID',
    example: '00000000-0000-4000-0000-000000000001',
  })
  clientId?: string;

  @IsString()
  @ApiProperty({
    description: 'Client country ID',
    example: 'b55b3f46-a784-4ff9-b053-b3193d191634',
  })
  countryId: string;

  @IsString()
  @ApiProperty({
    description: 'Client name',
    example: 'Coca Cola - LU',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Client Status',
    example: 'Active',
  })
  status?: ClientStatusEnum;

  @ValidateNested({each: true})
  @Type(() => CreateClientInformationDto)
  clientInformation: CreateClientInformationDto;
}
