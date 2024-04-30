import {IsOptional, IsUUID} from 'class-validator';

export class UserConsentDto {
  @IsUUID()
  @IsOptional()
  consentId?: string;
}
