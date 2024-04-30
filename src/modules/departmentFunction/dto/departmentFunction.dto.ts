import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID} from 'class-validator';

export class DepartmentFunctionDto {
  @IsUUID()
  @ApiProperty({
    description: 'Department function id',
    example: '98b3afa6-c55d-4830-9c50-5349fb11214a',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Department function name',
    example: 'Executive director / General manager',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Department function key name',
    example: 'executiveDirectorGeneralManager',
  })
  public keyName: string;

  @IsUUID()
  @ApiProperty({
    description: 'Department id',
    example: 'e2d3d533-7c6b-49a3-a310-85dce54be35f',
  })
  public departmentId: string;
}
