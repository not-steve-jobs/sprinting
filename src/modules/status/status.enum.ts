export enum UserStatus {
  Active = 'active',
  Disabled = 'disabled',
  Invited = 'invited',
  NotInvited = 'notInvited',
  InvitationExpired = 'invitationExpired',
  InvitationFailure = 'invitationFailure',
  CreationFailure = 'creationFailure',
}

export enum CaseStatus {
  Open = 'open',
  InProgress = 'inProgress',
  Closed = 'closed',
  Reopen = 'reopen',
}

export enum ContractStatus {
  Active = 'active',
  Unactive = 'unactive',
  Pending = 'pending',
  New = 'new',
  ToApprove = 'toApprove',
  Issued = 'issued',
  SentByPost = 'sentByPost',
  Validated = 'validated',
  Signed = 'signed',
  Disputed = 'disputed',
}

export enum InvoiceStatus {
  Paid = 'paid',
  Unpaid = 'unpaid',
  Issued = 'issued',
  Disputed = 'disputed',
  Canceled = 'canceled',
  Partial = 'partial',
}

export enum JobOrderStatus {
  Draft = 'draft',
  Submitted = 'submitted',
  CandidatesPreselection = 'candidatesPreselection',
  PartiallyCovered = 'partiallyCovered',
  FullyCovered = 'fullyCovered', //deprecated
  CanceledByTheClient = 'canceledByTheClient',
  CancelledByAdecco = 'cancelledByAdecco',
  Covered = 'covered',
  NotFilledByAdecco = 'notFilledByAdecco',
  InProgress = 'inProgress',
}

export enum JobOrderAssociateStatus {
  Application = 'application',
  Screening = 'screening',
  InternalInterview = 'internalInterview',
  Assessment = 'assessment',
  Assessment1 = 'assessment1',
  Submittal = 'submittal',
  SendOut = 'sendOut',
  References = 'references',
  Offer = 'offer',
  AdminCheck = 'adminCheck',
  PreContract = 'preContract',
  ClosingReport = 'closingReport',
}

export enum EmailNotificationStatus {
  Pending = 'pending',
  Sent = 'sent',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export enum EmailLogStatus {
  Pending = 'pending',
  Successful = 'successful',
  Failed = 'failed',
}
