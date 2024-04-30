import {UserProfile} from './userProfile.entity';

export class UserProfileFilterDto {
  id: string;
  firstName: string;
  lastName: string;

  constructor(obj: UserProfile) {
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
  }
}
