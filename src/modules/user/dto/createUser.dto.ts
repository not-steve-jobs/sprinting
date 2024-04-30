import {IsEmail, IsArray, IsString, ValidateNested, IsUUID, IsOptional} from 'class-validator';
import {Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';

class CreateUserPersonalInformationDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'user@@adeccogroup.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @IsUUID()
  @ApiProperty({
    description: 'User department id',
    example: 'b945be10-4034-4160-a839-02f8bb2b51fe',
  })
  department: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'User department function id',
    example: 'e4ada0e3-1177-46bf-b3e9-077f2bbc0517',
  })
  departmentFunction: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User custom department',
    example: 'Custom Department',
  })
  customDepartment?: string;

  @IsString()
  @ApiProperty({
    description: 'User title',
    example: 'Mr',
  })
  title: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'User main location id',
    example: '00000000-0000-4000-0000-000000001101',
  })
  mainLocationId: string;

  @IsUUID()
  @ApiProperty({
    description: 'User client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId?: string;

  @IsString()
  @IsOptional()
  public phonePrefix?: string;

  @IsString()
  @IsOptional()
  public phone?: string;

  @IsString()
  @IsOptional()
  public otherPhonePrefix?: string;

  @IsString()
  @IsOptional()
  public otherPhone?: string;
}

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'User id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  userId?: string;

  @ValidateNested({each: true})
  @Type(() => CreateUserPersonalInformationDto)
  personalInformation: CreateUserPersonalInformationDto;

  @IsArray()
  @ApiProperty({
    description: 'User permissions',
    example: '["00000000-0000-4000-0000-000000000001", "00000000-0000-4000-0000-000000000006"]',
  })
  permissions?: string[];

  @IsArray()
  @ApiProperty({
    description: 'User locations',
    example: '["00000000-0000-4000-0000-000000001107", "00000000-0000-4000-0000-000000001108"]',
  })
  locations?: string[];

  @ApiProperty({
    description: 'The ID of th Admin which invited the User to the platform',
    example: '00000000-0000-4000-0000-000000001107',
  })
  invitedByUserId?: string;
}
