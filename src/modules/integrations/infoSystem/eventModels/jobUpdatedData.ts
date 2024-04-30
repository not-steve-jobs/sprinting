import {DaysInWeekEnum} from '../../../jobOrder/jobOrder.enum';

export interface JobUpdatedData {
  additionalInformation: string;
  branchId: string;
  contractType: string;
  dateEnd: Date;
  dateStart: Date;
  id: string;
  interviewRequired: boolean;
  jobDescription: string;
  locationId: string;
  name: string;
  numberOfOpenings: number;
  rate: string;
  salary: number;
  salaryHigh: number;
  serviceType: string;
  shift: string;
  userId: string;
  daysInWeek: DaysInWeekEnum[];
  closingReason: number | string;
  isDisplayed: boolean;
  startTime?: string;
  endTime?: string;
  experience?: string;
}
