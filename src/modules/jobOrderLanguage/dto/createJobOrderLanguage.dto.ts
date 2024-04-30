import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber} from 'class-validator';

export class CreateJobOrderLanguageDto {
  @IsUUID()
  @ApiProperty({
    description: 'Language ID',
    example: '00000000-0000-4000-0000-000000000002',
  })
  public languageId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Level ID',
    example: '2',
  })
  public levelId: number;
}
