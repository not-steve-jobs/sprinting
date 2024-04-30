import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

class Item {
  @IsNumber()
  @ApiProperty({
    description: 'Id of item',
    example: 1,
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Item name',
    example: 'Item',
  })
  public name: string;
}

export class CandidateLocationDto {
  @IsNumber()
  @ApiProperty({
    description: 'Id of location',
    example: 1,
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'City name',
    example: 'Zurich',
  })
  public city: string;

  @IsString()
  @ApiProperty({
    description: 'Country name',
    example: 'Switzerland',
  })
  public country: string;

  @IsString()
  @ApiProperty({
    description: 'Formatted location name by using city and country',
    example: 'Zurich, Switzerland',
  })
  public locationName: string;
}

export class CandidatesFilterDataDto {
  @ApiProperty({
    description: 'All available candidate languages',
    example: [
      {id: 1, name: 'English'},
      {id: 2, name: 'German'},
    ],
  })
  public languages: Item[];

  @ApiProperty({
    description: 'All available candidate locations',
    example: [
      {
        id: 1,
        city: 'Zurich',
        country: 'Switzerland',
        locationName: 'Zurich, Switzerland',
      },
    ],
  })
  public locations: CandidateLocationDto[];

  @ApiProperty({
    description: 'All available candidate educations levels',
    example: [
      {id: 1, name: 'Professional certificate'},
      {id: 2, name: 'Bachelor degree'},
      {id: 3, name: 'Master degree'},
    ],
  })
  public educations: Item[];
}
