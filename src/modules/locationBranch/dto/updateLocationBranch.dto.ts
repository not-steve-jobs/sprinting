import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsBoolean} from 'class-validator';

export class UpdateLocationBranchDto {
  @IsUUID()
  @ApiProperty({
    description: 'Branch id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public branchId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Branch tenant id',
    example: 110,
  })
  public tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Branch location id',
    example: '00000000-0000-4000-0000-000000001160',
  })
  public locationId: string;

  @IsBoolean()
  @ApiProperty({
    description: 'In territory flag',
    example: true,
  })
  public inTerritory: boolean;
}
