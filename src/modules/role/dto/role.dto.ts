import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class RoleDto {
  @IsNumber()
  @ApiProperty({
    description: 'Role id',
    example: 1,
  })
  public id: number;

  @IsString()
  @ApiProperty({
    description: 'Role name',
    example: 'client-admin',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Role key name',
    example: 'clientAdmin',
  })
  public keyName: string;

  @ApiProperty({
    description: 'Role created date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Role updated date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;
}
