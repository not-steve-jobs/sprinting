import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty} from 'class-validator';

export enum ClientMenuLinkNameEnum {
  ORDER_MANAGEMENT = 'orderManagement',
  CONTRACTS = 'contracts',
  INVOICES = 'invoices',
  COMMUNICATION = 'communication',
  ONSITE_PORTAL = 'onsitePortal',
}

export enum ClientMenuLinkTypeEnum {
  RELATIVE = 'RELATIVE',
  ABSOLUTE = 'ABSOLUTE',
}

export enum MenuItemHostNameEnum {
  ONSITE = 'ONSITE',
  CLIENT_ACCESS = 'CLIENT_ACCESS',
}

export class ClientConfigurationMainMenuConfigDto {
  menuItems: ClientConfigurationMenuItemConfigDto[];
  clientMenuItems: ClientConfigurationMenuItemConfigDto[];
  disabledMenus: string[];
}

export class ClientConfigurationMenuItemConfigDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique name of the menu item',
    example: 'Invoice',
  })
  name: ClientMenuLinkNameEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Relative URL',
    example: '/client/invoice',
  })
  link: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'RELATIVE or ABSOLUTE',
    example: 'RELATIVE',
  })
  linkType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Host name to allow full URL definition',
    example: 'RELATIVE',
  })
  hostName: MenuItemHostNameEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of menu icon',
    example: 'OfficeChat',
  })
  iconName: string;

  @IsString()
  @ApiProperty({
    description: 'Full URL with host',
    example: 'https://testsite.com/client/invoice',
  })
  fullLink: string;
}
