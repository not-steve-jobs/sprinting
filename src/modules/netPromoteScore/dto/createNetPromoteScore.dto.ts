import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString, IsOptional} from 'class-validator';

export class CreateNetPromoteScoreDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Net Promote Score rate',
    example: 5,
  })
  public rate: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Net Promote Score Comment content',
    example: 'Test content of the Net Promote Score',
  })
  public comment: string;
}
