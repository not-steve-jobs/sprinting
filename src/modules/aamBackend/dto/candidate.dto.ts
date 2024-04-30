import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNumber, IsOptional, IsUUID, IsDate} from 'class-validator';

class WorkExperienceDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Years of experience',
    example: 3,
  })
  public yearsOfExperience?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Candidate role name',
    example: 'Bartender',
  })
  public roleName?: string;
}

export class CandidateDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Candidate id',
    example: 'cdfa316f-207d-4cdb-93e4-1e6d506d44ff',
  })
  public id?: string;

  @IsUUID()
  @ApiProperty({
    description: 'Info candidate id',
    example: 'cdfa316f-207d-4cdb-93e4-1e6d506d44ff',
  })
  public infoCandidateId?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Years of experience',
    example: 2,
  })
  public yearsOfExperience?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Candidate city',
    example: 'Berlin',
  })
  public city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Candidate country',
    example: 'Germany',
  })
  public country?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Candidate education type',
    example: 'University degree',
  })
  public educationType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Candidate languages',
    example: "['English','German']",
  })
  public languages?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Work experience of candidate',
    example: `[{"yearsOfExperience": 2,"roleName": "Bartender"}]`,
  })
  public workExperience?: WorkExperienceDto[];

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Date of scheduled interview',
  })
  public interviewDate?: Date;
}
