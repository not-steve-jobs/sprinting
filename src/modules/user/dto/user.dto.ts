import {ApiProperty} from '@nestjs/swagger';
import {User} from '../user.entity';
import {UserProfile} from '../../userProfile/userProfile.entity';
import {ConsentDto} from 'src/modules/consent/dto/consent.dto';

export class UserDto {
  @ApiProperty({
    description: 'User id',
    example: 'c87d445b-9c08-404f-bd95-7f54b902e230',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@adeccogroup.com',
  })
  email: string;

  @ApiProperty({
    description: 'User profile object',
  })
  userProfile: UserProfile;

  @ApiProperty({
    description: 'User email notification subscription',
    example: true,
  })
  emailNotifications: boolean;

  @ApiProperty({
    description: 'User client id',
    example: '00000000-0000-4000-0000-000000110000',
  })
  clientId: string;

  @ApiProperty({
    description: 'User unsigned consents',
  })
  unsignedConsents?: ConsentDto[];

  @ApiProperty({
    description: 'User create date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User update date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  constructor(obj: User) {
    this.id = obj.id;
    this.email = obj.email;
    this.userProfile = obj.userProfile;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.emailNotifications = obj.emailNotifications;
    this.clientId = obj.clientId;
    this.unsignedConsents = null;
  }
}
