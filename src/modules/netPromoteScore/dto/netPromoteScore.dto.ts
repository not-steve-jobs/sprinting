import {ApiProperty} from '@nestjs/swagger';
import {IsDate, IsNumber, IsString, IsUUID} from 'class-validator';

export class NetPromoteScoreDto {
  @IsUUID()
  @ApiProperty({
    description: 'Net Promote Score id',
    example: '00000000-0000-4000-0000-000000000116',
  })
  public id: string;

  @IsUUID()
  @ApiProperty({
    description: 'Net Promote Score tenant id',
    example: '116',
  })
  public tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Net Promote Score user id',
    example: '00000000-0000-4000-0000-000000000116',
  })
  public userId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Net Promote Score rate',
    example: 5,
  })
  public rate: number;

  @IsString()
  @ApiProperty({
    description: 'Net Promote Score Comment content',
    example: 'Test content of the Net Promote Score',
  })
  public comment: string;

  @IsDate()
  @ApiProperty({
    description: 'Net Promote Score created date',
    example: '2021-03-01 23:48:37',
  })
  public createdAt: Date;

  @IsDate()
  @ApiProperty({
    description: 'Net Promote Score updated date',
    example: '2021-03-01 23:48:37',
  })
  public updatedAt: Date;
}
