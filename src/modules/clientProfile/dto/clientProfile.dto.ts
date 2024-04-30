import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {PlainObject} from '../../common/common.dto';
import {ClientProfile} from '../clientProfile.entity';

export class ClientProfileDto {
  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000000116',
  })
  id: string;

  @ApiProperty({
    description: 'Business name',
    example: 'Coca Cola - US',
  })
  businessName: string;

  @ApiProperty({
    description: 'Number',
    example: '000000563',
  })
  number: string;

  @ApiProperty({
    description: 'Email address',
    example: 'cocacola-us-239@cocacola-us.com',
  })
  email: string;

  @ApiProperty({
    description: 'Clients phone number',
    example: '4984368183',
  })
  phone: string;

  @ApiProperty({
    description: 'Clients phone number prefix',
    example: '352',
  })
  phonePrefix: string;

  @ApiProperty({
    description: 'Web page url',
    example: 'cocacola-us.380.com',
  })
  web: string;

  @IsOptional()
  @ApiProperty({
    description: 'VAT number',
    example: '132453567',
  })
  VAT?: string;

  @IsOptional()
  @ApiProperty({
    description: 'All client locations',
  })
  locations?: PlainObject[];

  @ApiProperty({
    description: 'Client profile created date',
    example: '2021-03-01 23:48:37',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Client profile updated date',
    example: '2021-03-01 23:48:37',
  })
  updatedAt: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Client External Customer ID',
    example: 'a4p5w000000JFD5AAO',
  })
  externalCustomerId?: string;

  constructor(obj: ClientProfile) {
    this.id = obj.id;
    this.businessName = obj.businessName;
    this.number = obj.number;
    this.email = obj.email;
    this.phone = obj.phone;
    this.phonePrefix = obj.phonePrefix;
    this.web = obj.web;
    this.VAT = obj.VAT;
    this.locations = obj.locations;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.externalCustomerId = obj.externalCustomerId;
  }
}
