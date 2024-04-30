import {Test} from '@nestjs/testing';
import {AppConfigService} from 'src/core/config/appConfig.service';
import {QueueReceiver} from 'src/modules/queue/queueReceiver.interface';
import {QueueReceiverName} from 'src/modules/queue/queue.module';
import {ContentType} from 'src/modules/sendBackgroundNotification/contentType.enum';
import {MessageType} from 'src/modules/sendBackgroundNotification/messageType.enum';
import {BackgroundNotificationType} from 'src/modules/sendBackgroundNotification/backgroundNotification/backgroundNotificationType.enum';
import {EmailNotificationWorkerService} from './emailNotificationWorker.service';
import {SendgridNotificationSender} from './sendgridNotificationSender.service';

class FakeQueueReceiver implements QueueReceiver<null> {
  q: string[] = [];

  constructor() {
    this.q = [
      JSON.stringify({
        messageType: MessageType.Demo,
        notificationType: BackgroundNotificationType.Email,
        contentType: ContentType.Templated,
        templateType: 'Test Template',
        to: 'test1@email.com',
        content: {testKey: 'testValue'},
      }),
    ];
  }

  async notifyCompleteMessage() {
    return;
  }
  async notifyErroredMessage() {
    return;
  }
  async receiveMessage() {
    const value = this.q.shift();
    return value ? ([value, null] as [string, null]) : undefined;
  }
  async subscribeWorker() {
    return {
      unsubscribe: async () => {
        return;
      },
    };
  }
}

describe('EmailNotificationWorkerService', () => {
  let emailNotificationWorkerService: EmailNotificationWorkerService;
  let emailSender: SendgridNotificationSender;
  let queueReceiver: QueueReceiver<null>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailNotificationWorkerService,
        {
          provide: SendgridNotificationSender,
          useValue: {
            sendMail: () => {
              return;
            },
            sendMailWithTemplate: () => {
              return;
            },
            createBodyForTemplateEmail: () => {
              return;
            },
          },
        },
        {provide: QueueReceiverName, useClass: FakeQueueReceiver},
        {
          provide: AppConfigService,
          useValue: {
            get mailTemplates() {
              return [{name: 'Test Template', id: 'template1'}];
            },
          },
        },
      ],
    }).compile();

    moduleRef.useLogger({
      log() {
        return;
      },
      warn() {
        return;
      },
      error() {
        return;
      },
    });

    emailNotificationWorkerService = moduleRef.get<EmailNotificationWorkerService>(EmailNotificationWorkerService);
    emailSender = moduleRef.get<SendgridNotificationSender>(SendgridNotificationSender);
    queueReceiver = moduleRef.get<QueueReceiver<null>>(QueueReceiverName);
  });

  describe('processData', () => {
    it('should send an email', async () => {
      const receiveMessageSpy = jest.spyOn(queueReceiver, 'receiveMessage');
      const completeMessageSpy = jest.spyOn(queueReceiver, 'notifyCompleteMessage');
      const errorMessageSpy = jest.spyOn(queueReceiver, 'notifyErroredMessage');
      const sendEmailWithTemplateSpy = jest.spyOn(emailSender, 'sendMailWithTemplate');
      await emailNotificationWorkerService.processData();
      expect(receiveMessageSpy).toHaveBeenCalledWith('emailQueue');
      expect(receiveMessageSpy).toHaveBeenCalledTimes(2);
      expect(sendEmailWithTemplateSpy).toHaveBeenCalledTimes(1);
      expect(sendEmailWithTemplateSpy).toHaveBeenCalledWith(['test1@email.com'], 'template1', {
        testKey: 'testValue',
      });
      expect(completeMessageSpy).toHaveBeenCalledTimes(1);
      expect(errorMessageSpy).toHaveBeenCalledTimes(0);
    });
  });
});
