import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsObject, IsString} from 'class-validator';

class locationSortDto {
  @IsString()
  @ApiProperty({
    description: 'Location listing sort key',
    example: 'dateStart',
  })
  key: string;

  @IsString()
  @ApiProperty({
    description: 'Location listing sort direction',
    example: 'ASC|DESC',
  })
  value: string;
}

class locationSearchDto {
  @IsString()
  locationSearchQuery: string;
}

export class LocationListingDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Location listing page number',
    example: 1,
  })
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Location listing records per page',
    example: 10,
  })
  itemsPerPage: number;

  @IsObject()
  sort: locationSortDto;

  @IsObject()
  filter: locationSearchDto;
}
