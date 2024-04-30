import {ApiProperty} from '@nestjs/swagger';
import {Location} from '../location.entity';
import {LocationStatusEnum} from '../location.enum';

export class LocationSearchDto {
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

  @ApiProperty({
    description: 'Location name',
    example: 'Madrid Tech 1',
  })
  locationName: string;

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

  @ApiProperty({
    description: 'Location status',
    example: 'under-review',
  })
  status: LocationStatusEnum;

  constructor(obj: Location) {
    this.id = obj.id;
    this.clientId = obj.clientId;
    this.locationName = obj.locationName;
    this.street = obj.street;
    this.number = obj.number;
    this.city = obj.city;
    this.country = obj.country;
    this.state = obj.state;
    this.zip = obj.zip;
    this.status = obj.status;
  }
}
