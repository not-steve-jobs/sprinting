import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {Client} from '../../client/client.entity';
import {Location} from '../location.entity';
import {LocationStatusEnum} from '../location.enum';

export class LocationDto {
  @ApiProperty({
    description: 'Location id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  id: string;

  @ApiProperty({
    description: 'Location client id',
    example: '00000000-0000-4000-0000-000000116000',
  })
  clientId: string;

  @IsOptional()
  @ApiProperty({
    description: 'Client object',
  })
  client?: Client;

  @ApiProperty({
    description: 'Location flag if main location for client',
    example: true,
  })
  isMainLocation: boolean;

  @ApiProperty({
    description: 'Location name',
    example: 'Madrid Tech 1',
  })
  locationName: string;

  @IsOptional()
  @ApiProperty({
    description: 'Location address',
  })
  address?: string;

  @ApiProperty({
    description: 'Location street',
    example: 'Calle Orense',
  })
  street: string;

  @ApiProperty({
    description: 'Location street number',
    example: '69',
  })
  number: string;

  @ApiProperty({
    description: 'Location city',
    example: 'Madrid',
  })
  city: string;

  @ApiProperty({
    description: 'Location state',
    example: 'Spain',
  })
  state: string;

  @ApiProperty({
    description: 'Location country',
    example: 'Spain',
  })
  country: string;

  @ApiProperty({
    description: 'Location postal code',
    example: '38117',
  })
  zip: string;

  @IsOptional()
  @ApiProperty({
    description: 'Location latitude',
    example: 38.78548423,
  })
  lat?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Location longitude',
    example: -23.948327,
  })
  lng?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Location timezone',
    example: 'America/Los_Angeles',
  })
  timezone?: string;

  @ApiProperty({
    description: 'Location status',
    example: 'under-review',
  })
  status: LocationStatusEnum;

  @ApiProperty({
    description: 'Location create date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Location update date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  constructor(obj: Location) {
    this.id = obj.id;
    this.clientId = obj.clientId;
    this.client = obj.client;
    this.isMainLocation = obj.isMainLocation;
    this.locationName = obj.locationName;
    this.street = obj.street;
    this.number = obj.number;
    this.city = obj.city;
    this.country = obj.country;
    this.state = obj.state;
    this.zip = obj.zip;
    this.status = obj.status;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
