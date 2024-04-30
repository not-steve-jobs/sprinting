import {ApiProperty} from '@nestjs/swagger';
import {IsUUID, IsNumber, IsString, IsOptional, IsBoolean} from 'class-validator';

export class LocationBranchDto {
  // TODO: We don't have such field in the DB, maybe we should remove it?
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'LocationBranch id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public id?: string;

  @IsNumber()
  @ApiProperty({
    description: 'LocationBranch tenant id',
    example: 110,
  })
  public tenantId: number;

  // Note: It was missing, but adding it as optional for now
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'LocationBranch Branch id',
    example: 110,
  })
  public branchId?: string;

  @IsUUID()
  @ApiProperty({
    description: 'LocationBranch location id',
    example: '00000000-0000-4000-0000-000000001160',
  })
  public locationId: string;

  // TODO: We don't have such field in the DB, maybe we should remove it?
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'LocationBranch name',
    example: 'Berlin Tech center',
  })
  public name?: string;

  // Note: It was missing, but adding it as optional for now
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'LocationBranch in territory',
    example: false,
  })
  public inTerritory?: boolean;
}
