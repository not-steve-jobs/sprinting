import {ApiProperty} from '@nestjs/swagger';
import {IsUUID} from 'class-validator';

export class RegionPostalCodeDto {
  @IsUUID()
  @ApiProperty({
    description: 'Region id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  regionId: string;

  @ApiProperty({
    description: 'Postal COde',
    example: '123500',
  })
  public zip: string;

  @ApiProperty({
    description: 'Region Postal Code created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Region Postal Codeupdated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
