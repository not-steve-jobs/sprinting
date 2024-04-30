import {IsEmail, IsArray, IsString, ValidateNested, IsUUID, IsOptional} from 'class-validator';
import {Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';

class SalesForceCreateUserPersonalInformationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Users phone',
    example: '1238884444',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Users another phone',
    example: '1238885555',
  })
  otherPhone?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'User email address',
    example: 'user@@adeccogroup.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Street name',
    example: 'Some street name',
  })
  street?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Street name',
    example: 'Some additional street information',
  })
  street2?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'City',
    example: 'Berlin',
  })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'State name',
    example: 'Germany',
  })
  state?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Country name',
    example: 'Germany',
  })
  country?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Zip code',
    example: '123456',
  })
  zip?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email for escalations',
    example: 'craghu@hotmail.com',
  })
  escalationTimesheetApprover?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Email for billing',
    example: 'craghu@hotmail.com',
  })
  billToInvoiceEmail?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'ID from some other system',
    example: 'a4p5w000000IekhAAC',
  })
  externalContactId?: string;

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
  title?: string;

  @IsUUID()
  @ApiProperty({
    description: 'User client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId: string;
}

export class SalesForceCreateUserDto {
  @IsUUID()
  @ApiProperty({
    description: 'User id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  userId: string;

  @ValidateNested({each: true})
  @Type(() => SalesForceCreateUserPersonalInformationDto)
  personalInformation: SalesForceCreateUserPersonalInformationDto;

  @IsArray()
  @ApiProperty({
    description: 'User permissions',
    example: '["00000000-0000-4000-0000-000000000001", "00000000-0000-4000-0000-000000000006"]',
  })
  permissions: string[];

  @ApiProperty({
    description: 'Is user active or not',
    example: true,
  })
  inactive: boolean;

  @ApiProperty({
    description: "Define if user is 'admin'",
    example: true,
  })
  isAdmin: boolean;
}
