import {Injectable} from '@nestjs/common';
import {AppConfigService} from '../../core/config/appConfig.service';
import {Client} from '@googlemaps/google-maps-services-js';
import {Logger} from '../../core/logger';

@Injectable()
export class GoogleApiService {
  constructor(private readonly appConfig: AppConfigService, private readonly logger: Logger) {}

  private google = new Client({});

  public async googleGeocodeAddress(address: string) {
    try {
      return this.google
        .geocode({
          params: {
            address: address,
            key: this.appConfig.googleMaps.apiKey,
          },
        })
        .catch((e) => {
          this.logger.error(__filename, e);
        });
    } catch (error) {
      this.logger.error(__filename, error);
    }
  }

  public async googleTimezone(locationCoords: string, time: number) {
    try {
      return this.google
        .timezone({
          params: {
            location: locationCoords,
            timestamp: time,
            key: this.appConfig.googleMaps.apiKey,
          },
        })
        .catch((e) => {
          this.logger.error(__filename, e);
        });
    } catch (error) {
      this.logger.error(__filename, error);
    }
  }
}
