import {INestApplication} from '@nestjs/common';
import { Logger } from 'src/core/logger';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {GoogleApiService} from 'src/modules/googleApi/googleApi.service';
import {LocationRepository} from 'src/modules/location/location.repository';

export class LocationTimezone1640103587000 implements FixInterface {
  constructor (private readonly logger: Logger) {}

  public async execute(applicationInstance: INestApplication): Promise<any> {
    const locationRepository = applicationInstance.get(LocationRepository);
    
    const items = await locationRepository.findWithoutTimezone();

    const googleApiService = applicationInstance.get(GoogleApiService);
    for (const item of items) {
      if (!item.lat || !item.lng) continue;

      try {
        const timezone = await googleApiService.googleTimezone(`${item.lat},${item.lng}`, Math.round(Date.now() / 1000));
        
        timezone && await locationRepository.update(item.id, { timezone: timezone.data.timeZoneId });
      } catch (e) {
        this.logger.error(__filename, `Timezone fix error ${item.locationName}`, e);
      }
    }
  }
}