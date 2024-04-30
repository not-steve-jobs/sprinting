export enum CloseReasonEnum {
  Filled = 'filled',
  CompetitorFilled = 'competitorFilled',
  ClientFilled = 'clientFilled',
  CancelledByClient = 'cancelledByClient',
  CancelledByJobOwner = 'cancelledByJobOwner',
  SystemError = 'systemError',
  Other = 'other',
  PartiallyFulfilled = 'partiallyFulfilled',
  HiredByJobOwner = 'hiredByJobOwner',
  UnavailableEmployee = 'unavailableEmployee',
  ChangedPlans = 'changedPlans',
  OtherService = 'otherService',
  NotApproved = 'notApproved',
  CreditProblems = 'creditProblems',
  JobOwnerAbuse = 'jobOwnerAbuse',
  JobOwnerNoStandards = 'jobOwnerNoStandards',
  Discrimination = 'discrimination',
  ExcludedJobList = 'excludedJobList',
  PersonalSafety = 'personalSafety',
  BillRateNotAccept = 'billRateNotAccept',
}

export enum CloseReasonTypeEnum {
  Internal = 'internal',
  External = 'external',
  Common = 'common',
}
