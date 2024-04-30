import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsObject, IsOptional, IsArray} from 'class-validator';
import {FilterDto, SortDto} from '../../common/listing.dto';

export class JobOrderCandidatesListingDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  itemsPerPage: number;

  @IsObject()
  @ApiProperty({
    description: 'Table sort option',
    example: {key: 'number', value: 'ASC'},
  })
  sort: SortDto;

  @IsObject()
  @ApiProperty({
    description: 'Applied filters',
    example: {
      findIn: [
        {key: 'status', value: ['Draft']},
        {key: 'serviceType', value: ['Temporary']},
      ],
      status: ['Draft'],
      serviceType: ['Temporary'],
    },
  })
  filter: FilterDto;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'All loaded candidates',
    example: [
      'ae9f27bb-e9fe-427b-b470-8b9cbefddd1d',
      '32cc9e6a-04fd-40dd-b9f2-ec1320c46a58',
      '0236ecfe-c550-4e4a-abf9-de9f9063939b',
    ],
  })
  loadedCandidateIds?: string[];
}
