import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID} from 'class-validator';

export class DepartmentDto {
  @IsUUID()
  @ApiProperty({
    description: 'Department id',
    example: 'b945be10-4034-4160-a839-02f8bb2b51fe',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Department name',
    example: 'Corporate Social Responsibility',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    description: 'Department key name',
    example: 'corporateSocialResponsibility',
  })
  public keyName: string;
}
