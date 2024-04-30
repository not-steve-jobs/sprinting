import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID} from 'class-validator';

export class PermissionListDto {
  @IsUUID()
  @ApiProperty({
    description: 'Permission id',
    example: '00000000-0000-4000-0000-000000000004',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Permission name',
    example: 'contracts',
  })
  public name: string;
}
