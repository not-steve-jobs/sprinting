import {Injectable} from '@nestjs/common';
import {EntityManager} from 'typeorm';
import {TransformationsRepository} from './transformations.repository';
import {cloneDeep} from 'lodash';
import {Transformation} from './enums/transformations.types';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {BusMessageTypeEnum} from '../busMessage/busMessage.enum';

@Injectable()
export class TransformationsService {
  public transformationsRepository;
  constructor(private readonly manager: EntityManager, private readonly appConfig: AppConfigService) {
    this.transformationsRepository = this.manager.getCustomRepository(TransformationsRepository);
  }

  /**
   * Apply transformations to a specific InFO command/event payload
   *
   * @param {Transformation[]} transformations - List with transformation rules for this entity which should be applied to the payload
   * @param payload - The input payload which should be transformed // TODO: Add proper type
   */
  public async getPayloadWithTransformation(transformations: Transformation[], payload, type?) {
    let clonedPayload = cloneDeep(payload);

    if (this.appConfig.transformationsConfig.useCLPTransformations) {
      for (const transformation of transformations) {
        const whereClause = this.generateWhereClause(transformation.keys, payload);

        let propertyExist: boolean = false;
        for (const key of Object.keys(whereClause)) {
          if (!['brand', 'country'].includes(key)) {
            propertyExist = true;
            break;
          }
        }
        if (!propertyExist) {
          continue;
        }
        const result = await this.transformationsRepository.findOne(transformation.entity, whereClause);
        clonedPayload.parameters[transformation.source] = result ? result[transformation.targetColumnName] : null;
      }
    } else {
      if (type === BusMessageTypeEnum.COMMAND) {
        clonedPayload = {
          ...clonedPayload,
          parameters: {
            ...clonedPayload.parameters,
            ...clonedPayload.keyValues,
          },
        };
      }
    }

    delete clonedPayload.keyValues;
    return clonedPayload;
  }

  public generateWhereClause(keys, payload) {
    let clause = {};
    for (const key of keys) {
      if (payload.keyValues.hasOwnProperty(key)) {
        clause = {
          ...clause,
          [key]: payload.keyValues[key],
        };
      } else if (['brand', 'country'].includes(key)) {
        clause = {
          ...clause,
          [key]: payload[key],
        };
      }
    }
    return clause;
  }
}
