import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID, Max} from 'class-validator';

export class LanguageDto {
  @IsUUID(5)
  @ApiProperty({
    description: 'Language id',
    example: '00000000-0000-4000-0000-000000000051',
  })
  public id: string;

  @IsString()
  @Max(10)
  @ApiProperty({
    description: 'Language code',
    example: 'de',
  })
  public code: string;

  @Max(255)
  @ApiProperty({
    description: 'Language name',
    example: 'German',
  })
  public name: string;

  @Max(255)
  @ApiProperty({
    description: 'Language native name',
    example: 'Deutsch',
  })
  public nativeName: string;

  @ApiProperty({
    description: 'Language created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Language updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
