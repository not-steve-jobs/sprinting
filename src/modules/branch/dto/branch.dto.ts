import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsString} from 'class-validator';

export class BranchDto {
  @IsUUID()
  @ApiProperty({
    description: 'Branch id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Branch tenant id',
    example: 110,
  })
  public tenantId: number;

  @IsString()
  @ApiProperty({
    description: 'Branch name',
    example: 'Berlin Tech center',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Branch status',
    example: 'open',
  })
  public status: string;

  @ApiProperty({
    description: 'Branch create date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Branch update date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
