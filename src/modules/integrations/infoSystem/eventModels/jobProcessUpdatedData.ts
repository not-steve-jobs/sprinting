export interface JobProcessUpdatedData {
  userId: string;
  jobOrderId: string;
  status: string;
  rejected: boolean;
  interviewDate: Date;
}
