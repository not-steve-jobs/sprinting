import {DaysInWeekEnum} from '../../../jobOrder/jobOrder.enum';
import {MessageRecordType} from '../eventModels';

export interface CreateJobData {
  contactRecordType: MessageRecordType;
  additionalInformation: string;
  branchId: string;
  contractTypeId: number;
  dateEnd: Date;
  dateStart: Date;
  id: string;
  interviewRequired: boolean;
  jobDescription: string;
  locationId: string;
  name: string;
  numberOfOpenings: number;
  rateId: number;
  salary: number;
  salaryHigh: number;
  serviceTypeId: number;
  shiftId: number;
  userId: string;
  daysInWeek: DaysInWeekEnum[];
  experienceId: number;
  startTime: string;
  endTime: string;
  dayOneGuidance: string;
  sourceOfTheJob: string;
}
