import {forwardRef, Inject, Injectable, Logger} from '@nestjs/common';
import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {isEmpty} from 'lodash';

import {AppConfigService} from 'src/core/config/appConfig.service';
import {EmailLogService} from 'src/modules/emailLog/emailLog.service';
import {EmailLogStatus} from 'src/modules/status/status.enum';
import {
  BaseMmmHubEmailMessage,
  CheckEmailSendStatusResponse,
  CheckEmailSendStatusResponseData,
  CheckEmailSendStatusSuccessResponseData,
  FailedResponse,
  FailedResponseData,
  ResponseResult,
  SendEmailAcceptedResponseData,
  SendEmailResponse,
  SendEmailResponseData,
} from './mmmHub.type';
import {CustomHttpService} from '../../../customHttp/customHttp.service';

@Injectable()
export class MMMHubNotificationSender {
  /**
   * The default Logger service used to keep track of the executed actions and their statuses
   */
  private logger: Logger = new Logger(__filename);

  /**
   * Base path of the MMM Hub API
   */
  private apiBasePath: string;

  /**
   * The subscription key which is used to authenticate with the MMM Hub API
   */
  private apiSubscriptionKey: string;

  /**
   * A simple boolean which ensures that all of the required configs are set in place in order the service to operate
   */
  private isConfigured: boolean = false;

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly httpService: CustomHttpService,
    @Inject(forwardRef(() => EmailLogService))
    private readonly emailLogService: EmailLogService,
  ) {
    this.apiBasePath = appConfig.notificationSenderConfig.mmmHubApiBaseUrl;
    this.apiSubscriptionKey = appConfig.notificationSenderConfig.mmmHubApiSubscriptionKey;

    if (
      this.apiBasePath &&
      this.apiSubscriptionKey &&
      !isEmpty(this.apiBasePath) &&
      !isEmpty(this.apiSubscriptionKey)
    ) {
      this.isConfigured = true;
    }
  }

  /**
   * Send a request to MMM Hub to send an email.
   * Type parameter `T` is expected to be an object type containing the specific attributes for a certain `EventType`, as well as the `EventType` itself.
   *
   * @param message Details of the message to be sent.
   * @returns The result of the request (`accepted` or `failed`), plus attributes specific to either result. Note that `accepted` does *not* mean that the email was confirmed to be sent correctly.
   * @see SendEmailResponse
   */
  public async sendEmail<T>(message: BaseMmmHubEmailMessage<T>): Promise<SendEmailResponse> {
    if (!this.isConfigured) {
      return {
        result: ResponseResult.Failed,
        message: 'The MMM Hub service is not configured properly',
        status: 401,
        errorcode: 401,
        documentation: 'Please provide the ENV variables which are required by this service',
      };
    }

    const config: AxiosRequestConfig = this.getRequestConfig();
    const requestUrl: string = `${this.apiBasePath}/email`;
    const response: AxiosResponse<SendEmailResponseData> = await this.httpService
      .post(requestUrl, message, config)
      .toPromise();

    // There seems to be a bug in the MMM Hub API, where the API is documented to return a `202 Accepted` response, but it actually returns `200 OK`.
    // To ensure compatibility with a fixed version in the future, we check for any successful HTTP status code and assume the response payload is the correct one.
    if (this.isPayloadOfType<SendEmailAcceptedResponseData>(response, (r) => r.status >= 200 && r.status < 300)) {
      await this.emailLogService.create({
        messageKey: response.data.responses[0].messageKey,
        request: message,
        status: EmailLogStatus.Pending,
      });

      return {
        result: ResponseResult.Accepted,
        ...response.data,
      };
    } else {
      const failedResponseData = response.data as FailedResponseData;
      this.logger.error(`An error occurred while sending an email via MMM Hub. Error: ${failedResponseData}`);

      return {
        result: ResponseResult.Failed,
        status: response.status,
        ...failedResponseData,
      };
    }
  }

  /**
   * Check whether a specific response signatures for a fail
   *
   * @param response - The response which has to be checked
   * @returns {boolean} - A simply boolean whether the response failed
   */
  public isFailedResponse(response: {result: string}): response is FailedResponse {
    return response.result ? response.result === ResponseResult.Failed : false;
  }

  /**
   * Generate a simple axios config object which should be used when sending requests to the MMM Hub
   *
   * @returns {AxiosRequestConfig} - The serialized config with all the necessary headers
   */
  private getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.apiSubscriptionKey,
      },
    };
  }

  /**
   * Verify the type of the response's payload
   *
   * @param response - The response which payload we want to check
   * @param predicate - The condition for what kind of payload we're searching for
   * @returns {boolean} - A simple boolean whether the type of the response matches the the conditions of the predicate
   */
  private isPayloadOfType<T>(
    response: AxiosResponse,
    predicate: (r: AxiosResponse) => boolean,
  ): response is AxiosResponse<T> {
    return predicate(response);
  }

  /**
   * Send a request to MMM Hub to check for the status of a previously requested email delivery
   *
   * Note: A `success` result does not indicate anything about the mailing status.
   * In case of a successful response, the mailing status will be in the attribute `eventCategoryType` of the response.
   * If the response is `failed` it means that the HTTP call to retrieve the status failed, not that the email failed to send.
   *
   * @param {string }messageKey - Message key of the email request (returned when a send request is Accepted)
   * @returns {Promise<CheckEmailSendStatusResponse>} - The result of the HTTP request (`success` or `failed`) and the associated data
   */
  public async checkEmailSendStatus(messageKey: string): Promise<CheckEmailSendStatusResponse> {
    if (!this.isConfigured) {
      return {
        result: ResponseResult.Failed,
        message: 'The MMM Hub service is not configured properly',
        status: 401,
        errorcode: 401,
        documentation: 'Please provide the ENV variables which are required by this service',
      };
    }

    const config: AxiosRequestConfig = this.getRequestConfig();
    const requestUrl: string = `${this.apiBasePath}/email/status/${encodeURIComponent(messageKey)}`;
    const response: AxiosResponse<CheckEmailSendStatusResponseData> = await this.httpService
      .get(requestUrl, config)
      .toPromise();

    if (this.isPayloadOfType<CheckEmailSendStatusSuccessResponseData>(response, (r) => r.status === 200)) {
      return {
        result: ResponseResult.Success,
        ...response.data,
      };
    } else {
      const failedResponseData = response.data as FailedResponseData;
      return {
        result: ResponseResult.Failed,
        status: response.status,
        ...failedResponseData,
      };
    }
  }
}
