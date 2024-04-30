import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class JobOrderAssociatesDataXlsxDto {
  @IsString()
  @ApiProperty({
    description: 'Last 8 symbols of the reference number of the candidate',
    example: '1ece84dc',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'The name of the candidate',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Date of the search',
    example: '01/01/2022',
  })
  dateOfSearch: string;

  @IsString()
  @ApiProperty({
    description: 'The current status of the candidate',
    example: 'Placed',
  })
  status: string;

  @IsString()
  @ApiProperty({
    description: 'Years of experience of the candidate',
    example: '1-3 years',
  })
  yearsOfExperience: string;

  @IsString()
  @ApiProperty({
    description: 'The current status of the candidate',
    example: 'German-Advanced, English',
  })
  languages: string;

  @IsString()
  @ApiProperty({
    description: 'Location of the candidate',
    example: 'Berlin, Germany',
  })
  location: string;

  @IsString()
  @ApiProperty({
    description: 'University degree of the candidate',
    example: 'Bachelor',
  })
  universityDegree: string;

  @IsString()
  @ApiProperty({
    description: 'Previous working experience of the candidate',
    example: 'Bartender, Forklift Truck Driver',
  })
  workingExperience: string;
}
