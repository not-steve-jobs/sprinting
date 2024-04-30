import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator';

export class FilterDto {
  @ApiProperty({
    description: 'Array of objects with key and values for searching for a specified pattern in a column',
    example: [{key: 'name', value: 'John D'}],
  })
  findLike: any[];

  @ApiProperty({
    description: 'Array of objects with key and values for searching in array of values in specific scope',
    example: [{key: 'name', value: ['Aleksandar Manasijevic', 'Alvaro Lexington', 'Alvaro Smith']}],
  })
  findIn: any[];

  @ApiProperty({
    description: 'Array of objects with key and values for searching between two dates',
    example: [{key: 'dateStart', from: '2018-03-04T12:54:24+01:00', to: '2021-03-04T12:54:00+01:00'}],
  })
  findBetween: any[];

  @ApiProperty({
    description: 'Array of objects with key and values for searching between two dates',
    example: [
      {key: 'experienceLevel', value: ['1-2'], from: 1, to: 2},
      {key: 'language', value: ['English', 'Hindi']},
    ],
  })
  customFilter: any[];
}

export class SortDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Listing sort key',
    example: 'dateStart',
  })
  key: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Listing sort direction',
    example: 'ASC|DESC',
  })
  value: string;
}

export class ListingDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Listing page number',
    example: 1,
  })
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Listing records per page',
    example: 10,
  })
  itemsPerPage: number;

  @IsObject()
  @IsOptional()
  sort?: SortDto;

  @IsObject()
  @IsOptional()
  filter?: FilterDto;
}
