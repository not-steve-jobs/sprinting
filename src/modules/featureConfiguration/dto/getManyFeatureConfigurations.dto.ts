import {ApiProperty} from '@nestjs/swagger';
import {IsArray} from 'class-validator';
import {FeatureConfigurationIdentifier} from '../featureConfiguration.interface';

export class GetManyFeatureConfigurationsDto {
  @IsArray()
  @ApiProperty({
    description: 'List of pairs <feature, channel> for which we want to obtain information',
    example: '[{feature: "Localization", channel: "CLA"}]',
  })
  public query: FeatureConfigurationIdentifier[];
}
