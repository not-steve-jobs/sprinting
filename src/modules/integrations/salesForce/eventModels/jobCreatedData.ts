export interface JobCreatedData {
  jobId: string;
  externalJobId: string;
  clientInterviewMethod: string;
  workType: string;
  externalCustomerId: string;
  endTime: string;
  firstDayStartTime: string;
  jobDescription: string;
  name: string;
  branchCostCenter: string;
  serviceType: string;
  reportTo: string;
  createdBy: string;
  dateEnd: Date;
  dateStart: Date;
  startTime?: string;
  status: string;
  payRate?: number;
  numberOfOpenings: number;
  externalLocationId: string;
  daysInWeek: string;
  timeSheetApprover: string;
  department: string;
  additionalInformation: string;
  jobRole: string;
}
