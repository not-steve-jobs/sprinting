import {ApiProperty} from '@nestjs/swagger';

export class JobRoleTemplateDto {
  @ApiProperty({
    description: 'Job role Template id',
    example: '00000000-0000-4000-0000-000000001132',
  })
  id: string;

  @ApiProperty({
    description: 'Tenant id',
    example: 110,
  })
  tenantId: number;

  @ApiProperty({
    description: 'Job role id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  jobRoleId: string;

  @ApiProperty({
    description: 'Language Id',
    example: '00000000-0000-4000-0000-000003245553',
  })
  languageId: string;

  @ApiProperty({
    description: 'Job role template text',
    example: 'Job description',
  })
  template: string;

  @ApiProperty({
    description: 'Job role template date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Job role template date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
