import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsString} from 'class-validator';

export class SectorDto {
  @IsUUID()
  @ApiProperty({
    description: 'Sector id',
    example: '00000000-0000-4000-0000-000000000007',
  })
  public id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Sector tenant id',
    example: 110,
  })
  public tenantId: number;

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

  @ApiProperty({
    description: 'Sector created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Sector updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
