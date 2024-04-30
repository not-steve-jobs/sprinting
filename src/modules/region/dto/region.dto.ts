import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsString, IsUUID} from 'class-validator';

export class RegionDto {
  @IsUUID()
  @ApiProperty({
    description: 'Region id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  id: string;

  @IsUUID()
  @ApiProperty({
    description: 'Tenant id',
    example: '110',
  })
  tenantId: number;

  @IsString()
  @ApiProperty({
    description: 'Region name',
    example: 'High',
  })
  public name: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Default region flag if region default for client',
    example: true,
  })
  default: boolean;

  @ApiProperty({
    description: 'Region created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Region updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
