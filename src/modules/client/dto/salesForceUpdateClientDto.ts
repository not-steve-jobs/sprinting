import {IsString, ValidateNested, IsUUID, IsOptional} from 'class-validator';
import {Type} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';
import {ClientStatusEnum} from '../client.enum';

class SalesForceUpdateClientInformationDto {
  @IsString()
  @ApiProperty({
    description: 'Client External Customer ID',
    example: 'a4p5w000000JFD5AAO',
  })
  externalCustomerId: string;

  @IsString()
  @ApiProperty({
    description: 'Client Business Name',
    example: 'Coca Cola - LU',
  })
  businessName: string;

  @IsString()
  @ApiProperty({
    description: 'Client Street',
    example: '520 N WASHINGTON ST',
  })
  street: string;

  @IsString()
  @ApiProperty({
    description: 'Client Street 2',
    example: 'SUITE 320',
  })
  street2: string;

  @IsString()
  @ApiProperty({
    description: 'Client City',
    example: 'SANFORD',
  })
  city: string;

  @IsString()
  @ApiProperty({
    description: 'Client State',
    example: 'VA',
  })
  state: string;

  @IsString()
  @ApiProperty({
    description: 'Client Postal Code',
    example: '229806580',
  })
  zip: string;

  @IsString()
  @ApiProperty({
    description: 'Client Profile Country id',
    example: 'b55b3f46-a784-4ff9-b053-b3193d191634',
  })
  countryId: string;

  @IsString()
  @ApiProperty({
    description: 'Client National Account Manager code',
    example: 'FName LName',
  })
  nationalAccountManager: string;

  @IsString()
  @ApiProperty({
    description: 'Client Branch Cost Center',
    example: '020396',
  })
  branchCostCenter: string;

  @IsString()
  @ApiProperty({
    description: 'Client Customer Type',
    example: 'Corporate',
  })
  customerType: string;

  @IsString()
  @ApiProperty({
    description: 'Client Contract Required',
    example: true,
  })
  contractRequired: boolean;
}

export class SalesForceUpdateClientDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Client ID',
    example: '00000000-0000-4000-0000-000000000001',
  })
  clientId?: string;

  @IsString()
  @ApiProperty({
    description: 'Client country ID',
    example: 'b55b3f46-a784-4ff9-b053-b3193d191634',
  })
  countryId: string;

  @IsString()
  @ApiProperty({
    description: 'Client name',
    example: 'Coca Cola - LU',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Client Status',
    example: 'Active',
  })
  status: ClientStatusEnum;

  @ValidateNested({each: true})
  @Type(() => SalesForceUpdateClientInformationDto)
  clientInformation: SalesForceUpdateClientInformationDto;
}
