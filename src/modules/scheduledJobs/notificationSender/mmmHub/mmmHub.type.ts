export type BaseMmmHubEmailMessage<T> = {
  definitionKey: string;
  recipients: {
    contactKey: string;
    to: string;
    attributes: T;
  }[];
};

export type SendEmailAcceptedResponseData = {
  requestId: string;
  errorcode: number;
  responses: {
    messageKey: string;
  }[];
};

export type FailedResponseData = {
  message: string;
  errorcode: number;
  documentation: string;
};

export enum ResponseResult {
  Success = 'success',
  Failed = 'failed',
  Accepted = 'accepted',
}

export type FailedResponse = FailedResponseData & {
  result: ResponseResult.Failed;
  status: number;
};
export type SendEmailAcceptedResponse = SendEmailAcceptedResponseData & {
  result: ResponseResult.Accepted;
};

export type SendEmailResponse = SendEmailAcceptedResponse | FailedResponse;
export type SendEmailResponseData = SendEmailAcceptedResponseData | FailedResponseData;

export type CheckEmailSendStatusSuccessResponseData = {
  requestId: string;
  eventCategoryType: string;
  timestamp: string;
  compositeId: string;
  info: {
    messageKey: string;
    contactKey: string;
    to: string;
    statusCode: number;
    statusMessage: string;
  };
};

export type CheckEmailSendStatusSuccessResponse = CheckEmailSendStatusSuccessResponseData & {
  result: ResponseResult.Success;
};
export type CheckEmailSendStatusResponseData = CheckEmailSendStatusSuccessResponseData | FailedResponseData;

export type CheckEmailSendStatusResponse = CheckEmailSendStatusSuccessResponse | FailedResponse;

export enum MMMHubTransactionalSendEvents {
  EmailQueued = 'TransactionalSendEvents.EmailQueued',
  EmailSent = 'TransactionalSendEvents.EmailSent',
  EmailNotSent = 'TransactionalSendEvents.EmailNotSent',
  EmailBounced = 'TransactionalSendEvents.EmailBounced',
}
