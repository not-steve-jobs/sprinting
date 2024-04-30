import {Tenant} from '../../tenant/tenant.entity';
import {IsNumber} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class FeatureConfigurationDto<T = any> {
  @IsNumber()
  @ApiProperty({
    description: 'Feature configuration tenant id',
    example: 110,
  })
  public tenantId: number;

  @ApiProperty({
    description: 'Feature configuration tenant object',
  })
  public tenant: Tenant; // TODO: Maybe remove this, it's no longer part of the response payload

  @ApiProperty({
    description: 'Feature configuration channel',
    example: 'CLA',
  })
  public channel: string;

  @ApiProperty({
    description: 'Feature configuration feature',
    example: 'locations',
  })
  public feature: string;

  @ApiProperty({
    description: 'Feature configuration config data',
    example: '{"status": "active"}',
  })
  public config: T;

  @ApiProperty({
    description: 'Feature configuration enabled flag',
    example: false,
  })
  public isEnabled: boolean;

  @ApiProperty({
    description: 'Feature configuration create date',
    example: '2021-02-22 22:56:41',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Feature configuration update date',
    example: '2021-02-22 22:56:41',
  })
  public updatedAt: Date;
}
