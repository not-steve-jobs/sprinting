import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsObject} from 'class-validator';
import {FilterDto, SortDto} from '../../common/listing.dto';

export class JobOrderListingDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Active page number',
    example: '2',
  })
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of items per page',
    example: '10',
  })
  itemsPerPage: number;

  @IsObject()
  @ApiProperty({
    description: 'Table sort option',
    example: '{key: "number", value: "ASC"}',
  })
  sort: SortDto;

  @IsObject()
  @ApiProperty({
    description: 'Applied filters',
    example:
      '{"findIn":[{"key":"status","value":["Draft"]},{"key":"serviceType","value":["Temporary"]}],"status":["Draft"],"serviceType":["Temporary"]}',
  })
  filter: FilterDto;
}
