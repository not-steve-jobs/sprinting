import {ApiProperty} from '@nestjs/swagger';

export class InfoCreateBranchDto {
  @ApiProperty({
    description: 'Branch id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public id?: string;

  @ApiProperty({
    description: 'Branch tenant id',
    example: 110,
  })
  public tenantId: number;

  @ApiProperty({
    description: 'Branch name',
    example: 'Berlin Tech center',
  })
  public name?: string;

  @ApiProperty({
    description: 'Branch status',
    example: 'open',
  })
  public status?: string;

  @ApiProperty({
    description: 'Branch cost center',
    example: 'Berlin cost center',
  })
  public branchCostCenter?: string;
}
