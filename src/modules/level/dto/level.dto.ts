import {EntityName} from './../../common/entityName.interface';
import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class LevelDto {
  @IsNumber()
  @ApiProperty({
    description: 'Level id',
    example: '1',
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Describes for which entity we are using this level',
    example: EntityName.Language,
  })
  public entityName: string;

  @IsString()
  @ApiProperty({
    description: 'Level name',
    example: 'Beginner',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Level key name',
    example: 'beginner',
  })
  public keyName: string;

  @ApiProperty({
    description: 'Level created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Level updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
