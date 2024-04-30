import {Injectable} from '@nestjs/common';
import {CloseReason} from '../closeReason/closeReason.entity';
import {CloseReasonEnum} from '../closeReason/closeReason.enum';
import {PersonService} from '../person/person.service';
import {UserProfileRepository} from '../userProfile/userProfile.repository';
import {CloseReasonService} from '../closeReason/closeReason.service';
import {CloseReasonArgumentsDto} from './dto/closeReasonArguments.dto';
import {CloseReasonArguments} from './closeReasonArguments.entity';
import {CloseReasonArgumentsError} from './closeReasonArguments.error';
import {CloseReasonArgumentsRepository} from './closeReasonArguments.repository';
import {PersonDto} from '../person/dto/person.dto';
import {UserProfileDto} from '../userProfile/dto/userProfile.dto';
import {JobOrderStatus} from '../status/status.enum';

interface ReasonProperties {
  userId: string;
  comment: string;
  tenantName: string;
  closeReasonId: number;
  isClosedFromCLA: boolean;
}

@Injectable()
export class CloseReasonArgumentsService {
  constructor(
    private readonly personService: PersonService,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly closeReasonService: CloseReasonService,
    private readonly closeReasonArgumentsRepository: CloseReasonArgumentsRepository,
  ) {}

  /**
   * Returns CloseReasonArguments data by given tenant and job order ids as a Promise.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} jobOrderId - Id of current job order
   * @returns {Promise<CloseReasonArguments>} - Promise, retrieving the data
   */
  public async findOne(tenantId: number, jobOrderId: string): Promise<CloseReasonArguments> {
    return this.closeReasonArgumentsRepository.findOne(tenantId, jobOrderId);
  }

  /**
   * Saves a new CloseReasonArguments data.
   *
   * @param {CloseReasonArguments} entity - New CloseReasonArguments data
   * @returns {Promise<CloseReasonArguments>} - Promise, retrieving the saved data
   */
  public async save(entity: CloseReasonArguments): Promise<CloseReasonArguments> {
    return this.closeReasonArgumentsRepository.save(entity);
  }

  /**
   * Creates and saves the close reason for a given tenant and job order ids. Checks if the information is correct or missing, e.g. if the provided reason is type "other" the comment is required.
   *
   * @param {number} tenantId - Id of current tenant
   * @param {string} jobOrderId - Id of current job order
   * @param {ReasonProperties} data - Data for closing a job order, provided by the end-user
   * @returns {Promise<CloseReasonArgumentsDto>} - Promise, retrieving the data for the closing reason
   */
  public async create(tenantId: number, jobOrderId: string, data: ReasonProperties): Promise<CloseReasonArgumentsDto> {
    try {
      const closeReason: CloseReason = await this.closeReasonService.findOne(tenantId, data.closeReasonId);
      if (closeReason) {
        if (closeReason.reason === CloseReasonEnum.Other && (!data.comment || data.comment === '')) {
          throw new Error('No comment provided: CloseReason type other must have a comment.');
        } else {
          const closeReasonArgs: CloseReasonArguments = await this.save(
            new CloseReasonArguments({
              tenantId,
              jobOrderId,
              closeReason,
              closedBy: data.userId,
              comment: data.comment,
            }),
          );
          return new CloseReasonArgumentsDto(closeReasonArgs, data.isClosedFromCLA, data.tenantName);
        }
      } else {
        throw new Error(
          'Parameter closeReasonId not found: The proveded closeReasonId was not found in the database OR not supported for this user.',
        );
      }
    } catch (er) {
      throw new CloseReasonArgumentsError.CloseReasonArgumentsCreateError(null, er);
    }
  }

  /**
   * Retrieves the first and last name of the user who closed the current job order (provided by the CloseReasonArguments entity). Communicates with PersonService to retrieve data for the external users. If the job order is not closed by Adecco or the client, the method retuns an empty string.
   *
   * @param {CloseReasonArguments} entity - Current CloseReasonArguments of the job order
   * @param {string} jobOrderStatus - Current status of the job order
   * @returns {Promise<string>} - Promise, retrieving the name of the person
   */
  public async getClosedByUserName(entity: CloseReasonArguments, jobOrderStatus: string): Promise<string> {
    if (jobOrderStatus === JobOrderStatus.CanceledByTheClient) {
      const userProfile: UserProfileDto = await this.userProfileRepository.findOne(entity.closedBy);
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (jobOrderStatus === JobOrderStatus.CancelledByAdecco) {
      const person: PersonDto = await this.personService.getById(entity.tenantId, entity.closedBy);
      return `${person.firstName} ${person.lastName}`;
    }
    return '';
  }

  public async delete(entity: CloseReasonArguments): Promise<CloseReasonArguments> {
    return this.closeReasonArgumentsRepository.delete(entity);
  }
}
