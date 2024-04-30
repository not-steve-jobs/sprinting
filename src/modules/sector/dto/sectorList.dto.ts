import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID} from 'class-validator';

export class SectorListDto {
  @IsUUID()
  @ApiProperty({
    description: 'Sector id',
    example: '00000000-0000-4000-0000-000000000007',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Sector name',
    example: 'Banking / Financial Services',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Sector key name',
    example: 'bankingFinancialServices',
  })
  public keyName: string;
}
