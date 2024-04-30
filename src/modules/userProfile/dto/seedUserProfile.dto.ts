import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {UserProfile} from '../userProfile.entity';
import {PreferencesDto} from './preferences.dto';

export class SeedUserProfileDto {
  @ApiProperty({
    description: 'User id',
    example: 'c87d445b-9c08-404f-bd95-7f54b902e230',
  })
  id: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'John',
  })
  lastName: string;

  @ApiProperty({
    description: 'User phone prefix',
    example: '357',
  })
  phonePrefix: string;

  @ApiProperty({
    description: 'User phone number',
    example: '7263377008',
  })
  phone: string;

  @ApiProperty({
    description: 'User second phone prefix',
    example: '237',
  })
  otherPhonePrefix: string;

  @ApiProperty({
    description: 'User second phone number',
    example: '7263377009',
  })
  otherPhone: string;

  @ApiProperty({
    description: 'User language',
    example: 'English',
  })
  language: string;

  @ApiProperty({
    description: 'User worksite',
    example: 'Worksite3',
  })
  worksite: string;

  @ApiProperty({
    description: 'User data access',
    example: false,
  })
  dataAccess: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'User main location id',
    example: '00000000-0000-4000-0000-000000001165',
  })
  mainLocationId?: string;

  @ApiProperty({
    description: 'User title',
    example: 'Manager',
  })
  title: string;

  @IsOptional()
  @ApiProperty({
    description: 'User department id',
    example: '09b8194e-153f-42ce-96b2-251360bcc3db',
  })
  departmentId?: string;

  @IsOptional()
  @ApiProperty({
    description: 'User department function id',
    example: 'bdc0d4b4-2f76-4654-8ef7-9e95dd431e7d',
  })
  departmentFunctionId?: string;

  @ApiProperty({
    description: 'User custom department',
    example: 'Custom Department',
  })
  customDepartment?: string;

  @ApiProperty({
    description: 'User preferences',
    example: '{"isJobOrderChartShown": true}',
  })
  preferences?: PreferencesDto;

  @ApiProperty({
    description: 'User notifications',
    example: false,
  })
  notifications: boolean;

  @ApiProperty({
    description: 'User consent',
    example: false,
  })
  consent: boolean;

  @ApiProperty({
    description: 'User portability',
    example: false,
  })
  portability: boolean;

  @ApiProperty({
    description: 'User created date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  constructor(obj: UserProfile) {
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.phonePrefix = obj.phonePrefix;
    this.phone = obj.phone;
    this.language = obj.language;
    this.worksite = obj.worksite;
    this.dataAccess = obj.dataAccess;
    this.mainLocationId = obj.mainLocationId;
    this.title = obj.title;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.departmentId = obj.departmentId;
    this.departmentFunctionId = obj.departmentFunctionId;
    this.customDepartment = obj.customDepartment;
    this.preferences = obj.preferences;
  }
}
