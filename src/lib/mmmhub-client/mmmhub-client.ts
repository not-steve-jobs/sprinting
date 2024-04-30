import axios, {AxiosResponse} from 'axios';

type SubscriptionKeyProvider = string | (() => string) | (() => Promise<string>);

type BaseEmailMessage<T> = {
  definitionKey: string;
  recipients: {
    contactKey: string;
    to: string;
    attributes: T;
  }[];
};

type SendEmailAcceptedResponseData = {
  requestId: string;
  errorcode: number;
  responses: {
    messageKey: string;
  }[];
};
type FailedResponseData = {
  message: string;
  errorcode: number;
  documentation: string;
};

type SendEmailResponseData = SendEmailAcceptedResponseData | FailedResponseData;

type FailedResponse = FailedResponseData & {result: 'failed'; status: number};
type SendEmailAcceptedResponse = SendEmailAcceptedResponseData & {result: 'accepted'};

type SendEmailResponse = SendEmailAcceptedResponse | FailedResponse;

type CheckEmailSendStatusSuccessResponseData = {
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

type CheckEmailSendStatusSuccessResponse = CheckEmailSendStatusSuccessResponseData & {result: 'success'};
type CheckEmailSendStatusResponseData = CheckEmailSendStatusSuccessResponseData | FailedResponseData;

type CheckEmailSendStatusResponse = CheckEmailSendStatusSuccessResponse | FailedResponse;

function isPayloadOfType<T>(
  response: AxiosResponse,
  predicate: (r: AxiosResponse) => boolean,
): response is AxiosResponse<T> {
  return predicate(response);
}

function isFailedResponse(response: {result: string}): response is FailedResponse {
  return response.result ? response.result === 'failed' : false;
}

/**
 * Client for the MMM Hub notification solution.
 */
class MMMHubClient {
  /**
   * Subscription key to the MMM Hub APIM. Can be:
   * - the key directly as a `string`,
   * - a function returning the key as a `string`, or
   * - a function returning a promise that resolves to the key
   */
  private subscriptionKeyProvider: SubscriptionKeyProvider;

  /**
   * Base path of the MMM Hub API
   */
  private apiBasePath: string;

  constructor(authenticationTokenProvider: SubscriptionKeyProvider, apiBasePath: string) {
    this.subscriptionKeyProvider = authenticationTokenProvider;
    this.apiBasePath = apiBasePath;
    axios.defaults.timeout = 30000;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  /**
   * Requests MMM Hub to send an email.
   * Type parameter `T` is expected to be an object type containing the specific attributes for a certain `EventType`, as well as the `EventType` itself.
   * @param message Details of the message to be sent.
   * @returns The result of the request (`accepted` or `failed`), plus attributes specific to either result. Note that `accepted` does *not* mean that the email was confirmed to be sent correctly.
   * @see SendEmailResponse
   */
  public async sendEmail<T>(message: BaseEmailMessage<T>): Promise<SendEmailResponse> {
    const config = {
      headers: {
        'Ocp-Apim-Subscription-Key': await this.getSubscriptionKey(),
      },
    };
    const response: AxiosResponse<SendEmailResponseData> = await axios.post(
      `${this.apiBasePath}/email`,
      message,
      config,
    );
    // There seems to be a bug in the MMM Hub API, where the API is documented to return a `202 Accepted` response, but it actually returns `200 OK`.
    // To ensure compatibility with a fixed version in the future, we check for any successful HTTP status code and assume the response payload is the correct one.
    if (isPayloadOfType<SendEmailAcceptedResponseData>(response, (r) => r.status >= 200 && r.status < 300)) {
      return {
        result: 'accepted',
        ...response.data,
      };
    } else {
      const failedResponseData = response.data as FailedResponseData;
      return {
        result: 'failed',
        status: response.status,
        ...failedResponseData,
      };
    }
  }

  /**
   * Checks MMM Hub for the status of a previously requested email delivery
   * @param messageKey Message key of the email request (returned when a send request is Accepted)
   * @returns The result of the HTTP request (`success` or `failed`) and the associated data.
   *          Note: A `success` result does not indicate anything about the mailing status.
   *                In case of a successful response, the mailing status will be in the attribute `eventCategoryType` of the response.
   *                `failed` means that the HTTP call to retrieve the status failed, not that the email failed to send.
   */
  public async checkEmailSendStatus(messageKey: string): Promise<CheckEmailSendStatusResponse> {
    const config = {
      headers: {
        'Ocp-Apim-Subscription-Key': await this.getSubscriptionKey(),
      },
    };
    const response: AxiosResponse<CheckEmailSendStatusResponseData> = await axios.get(
      `${this.apiBasePath}/email/status/${encodeURIComponent(messageKey)}`,
      config,
    );
    if (isPayloadOfType<CheckEmailSendStatusSuccessResponseData>(response, (r) => r.status === 200)) {
      return {
        result: 'success',
        ...response.data,
      };
    } else {
      const failedResponseData = response.data as FailedResponseData;
      return {
        result: 'failed',
        status: response.status,
        ...failedResponseData,
      };
    }
  }

  private async getSubscriptionKey(): Promise<string> {
    if (typeof this.subscriptionKeyProvider === 'string') {
      return this.subscriptionKeyProvider;
    }

    const providerFuncResult = this.subscriptionKeyProvider();
    if (typeof providerFuncResult === 'string') {
      return providerFuncResult;
    } else {
      return await providerFuncResult;
    }
  }
}

export {MMMHubClient, CheckEmailSendStatusResponse, SendEmailResponse, BaseEmailMessage, isFailedResponse};
