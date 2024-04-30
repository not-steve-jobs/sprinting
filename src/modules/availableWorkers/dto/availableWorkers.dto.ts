import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsUUID} from 'class-validator';

export class AvailableWorkersDto {
  @IsUUID()
  @ApiProperty({
    description: 'Id of available workers for role in tenant',
    example: '00000000-0000-0000-0000-000000000001',
  })
  id: string;

  @IsNumber()
  @ApiProperty({
    description: 'Tenant id',
    example: 137,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Job role id',
    example: '00000000-0000-0000-0000-000000001101',
  })
  jobRoleId: string;

  @ApiProperty({
    description: 'Available workers',
    example: 10,
  })
  availableWorkers: number;

  @ApiProperty({
    description: 'Available workers created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Available workers updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
