import {INestApplication} from '@nestjs/common';
import {UtilsHelper} from 'src/helpers/utils.helper';
import {FixInterface} from 'src/modules/fix/fix.interface';
import {LocationRepository} from 'src/modules/location/location.repository';
import {GoogleApiService} from 'src/modules/googleApi/googleApi.service';
import {Logger} from 'src/core/logger';

export class LocationCoordsAdd1637846575000 implements FixInterface {
  public async execute(applicationInstance: INestApplication, logger?: Logger): Promise<any> {
    const locationRepository = applicationInstance.get(LocationRepository);
    const helpers = applicationInstance.get(UtilsHelper);

    const items = await locationRepository.findWithoutCoords();

    const googleApiService = applicationInstance.get(GoogleApiService);
    logger.info(__filename, `Locations without coordinates ${(items ?? []).length}`);
    
    for (const item of items) {
      try {
        if (!item.city || !item.street || !item.number) {
          continue;
        }
        const coords = await googleApiService.googleGeocodeAddress(`${item.city}, ${item.street} ${item.number}`);

        const parsedCoords = coords && helpers.parseCoords(coords, 'coords');
        parsedCoords && await locationRepository.update(item.id, {lat: parsedCoords.lat, lng: parsedCoords.lng});
      } catch (error) {
        logger.error(__filename, `Adding coordinates error ${item.locationName}`, error);
      }
    }
  }
}
