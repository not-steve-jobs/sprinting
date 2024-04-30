import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsString} from 'class-validator';

export class CertificationDto {
  @IsUUID()
  @ApiProperty({
    description: 'Branch id',
    example: '00000000-0000-4000-0000-000000000002',
  })
  public id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Certification tenant id',
    example: 110,
  })
  public tenantId: number;

  @IsString()
  @ApiProperty({
    description: 'Certification name',
    example: 'Acting Assistant Principle',
  })
  public name: string;

  @ApiProperty({
    description: 'Certification create date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Certification update date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
