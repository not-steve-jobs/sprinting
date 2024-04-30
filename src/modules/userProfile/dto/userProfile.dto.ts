import {ApiProperty} from '@nestjs/swagger';
import {UserProfile} from '../userProfile.entity';
import {Location} from './../../location/location.entity';
import {PreferencesDto} from './preferences.dto';
import {User} from 'src/modules/user/user.entity';

export class UserProfileDto {
  @ApiProperty({
    description: 'User id',
    example: 'c87d445b-9c08-404f-bd95-7f54b902e230',
  })
  id: string;

  @ApiProperty({
    description: 'User object',
  })
  user: User;

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

  @ApiProperty({
    description: 'User main location id',
    example: '00000000-0000-4000-0000-000000001165',
  })
  mainLocationId?: string;

  @ApiProperty({
    description: 'User main location object',
  })
  mainLocation?: Location;

  @ApiProperty({
    description: 'User title',
    example: 'Manager',
  })
  title: string;

  @ApiProperty({
    description: 'User department id',
    example: '09b8194e-153f-42ce-96b2-251360bcc3db',
  })
  departmentId: string;

  @ApiProperty({
    description: 'User department function id',
    example: 'bdc0d4b4-2f76-4654-8ef7-9e95dd431e7d',
  })
  departmentFunctionId: string;

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
    description: 'User counter of opened cases before NPS is shown',
    example: 1,
  })
  caseCounter: number;

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
    this.user = obj.user;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.phonePrefix = obj.phonePrefix;
    this.phone = obj.phone;
    this.otherPhonePrefix = obj.otherPhonePrefix;
    this.otherPhone = obj.otherPhone;
    this.language = obj.language;
    this.worksite = obj.worksite;
    this.dataAccess = obj.dataAccess;
    this.mainLocationId = obj.mainLocationId;
    this.mainLocation = obj.mainLocation;
    this.title = obj.title;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.departmentId = obj.departmentId;
    this.departmentFunctionId = obj.departmentFunctionId;
    this.customDepartment = obj.customDepartment;
    this.preferences = obj.preferences;
    this.caseCounter = obj.caseCounter;
  }
}
