import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsObject, IsOptional, IsString} from 'class-validator';
import {Department} from '../../department/department.entity';
import {DepartmentFunction} from '../../departmentFunction/departmentFunction.entity';

export class UpsertUserProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User last name',
    example: 'John',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User phone prefix',
    example: '357',
  })
  phonePrefix: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User phone number',
    example: '7263377008',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User second phone prefix',
    example: '237',
  })
  otherPhonePrefix: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User second phone number',
    example: '7263377009',
  })
  otherPhone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User language',
    example: 'English',
  })
  language: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User worksite',
    example: 'Worksite3',
  })
  worksite: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User main location id',
    example: '00000000-0000-4000-0000-000000001165',
  })
  mainLocationId?: string;

  @IsString()
  @ApiProperty({
    description: 'User title',
    example: 'Manager',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User reason for disabling',
    example: 'User left the company',
  })
  disableReason: string;

  @IsObject()
  department?: Department;

  @IsObject()
  departmentFunction?: DepartmentFunction;

  @IsString()
  @IsOptional()
  customDepartment?: string;

  @IsNumber()
  @ApiProperty({
    description: 'User counter of opened cases before NPS is shown',
    example: 1,
  })
  caseCounter?: number;
}
