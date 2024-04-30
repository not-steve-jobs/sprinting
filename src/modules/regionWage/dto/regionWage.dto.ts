import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsUUID} from 'class-validator';

export class RegionWageDto {
  @IsUUID()
  @ApiProperty({
    description: 'Region Wage id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Region wage tenant id',
    example: 110,
  })
  tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Region id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  regionId: string;

  @ApiProperty({
    description: 'Job role id',
    example: '00000000-0000-4000-0000-000000001101',
  })
  jobRoleId: string;

  @ApiProperty({
    description: 'Expirence Level id',
    example: 10,
  })
  experienceLevelId: number;

  @ApiProperty({
    description: 'Minimum wage',
    example: '10',
  })
  minimum: number;

  @ApiProperty({
    description: 'Suggested wage',
    example: '10',
  })
  suggested: number;

  @ApiProperty({
    description: 'Region wage created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Region wage updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
