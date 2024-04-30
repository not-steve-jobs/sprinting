import {ApiProperty} from '@nestjs/swagger';
import {JobRole} from '../jobRole.entity';

export class JobRoleFilterDto {
  @ApiProperty({
    description: 'Job role id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  id: string;

  @ApiProperty({
    description: 'Job role tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Job role name',
    example: 'Housekeeper',
  })
  name: string;

  constructor(obj: JobRole) {
    this.id = obj.id;
    this.tenantId = obj.tenantId;
    this.name = obj.name;
  }
}
