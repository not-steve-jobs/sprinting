import {IsString, IsUUID, Max} from 'class-validator';

export class CountryDto {
  @IsUUID(5)
  public id: string;

  @IsString()
  @Max(10)
  public code: string;

  @Max(255)
  public name: string;

  @Max(10)
  public callingCode: string;

  public createdAt: Date;

  public updatedAt: Date;
}
