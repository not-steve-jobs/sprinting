import {IsBoolean} from 'class-validator';

export class UserMarketingConsentDto {
  @IsBoolean()
  isAccepted: boolean;
}
