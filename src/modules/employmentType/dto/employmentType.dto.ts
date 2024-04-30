import {IsNumber, IsString} from 'class-validator';

export class EmploymentTypeDto {
  @IsNumber()
  public id: number;

  @IsNumber()
  public tenantId: number;

  @IsString()
  public name: string;

  public createdAt: Date;

  public updatedAt: Date;
}
