import {ApiProperty} from '@nestjs/swagger';
import {IsDate, IsEnum, IsNumber, IsString, IsUUID} from 'class-validator';
import {ConsentType} from '../consentType.enum';

export class ConsentDto {
  @IsNumber()
  @ApiProperty({
    description: 'Consent tenant id',
    example: 110,
  })
  public tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Consent id',
    example: '00000000-0000-4000-0000-000000000116',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Consent url',
    example: '/client/terms-of-use',
  })
  public url: string;

  @IsEnum(ConsentType)
  @ApiProperty({
    description: 'Consent type',
    example: 'TERMS_AND_CONDITIONS',
  })
  public type: string;

  @IsNumber()
  @ApiProperty({
    description: 'Consent version',
    example: 1,
  })
  public version: number;

  @IsDate()
  @ApiProperty({
    description: 'Consent valid from',
    example: '2021-03-01 23:48:37',
  })
  public validFrom: Date;

  @IsDate()
  @ApiProperty({
    description: 'Consent created date',
    example: '2021-03-01 23:48:37',
  })
  public createdAt: Date;

  @IsDate()
  @ApiProperty({
    description: 'Consent updated date',
    example: '2021-03-01 23:48:37',
  })
  public updatedAt: Date;
}
