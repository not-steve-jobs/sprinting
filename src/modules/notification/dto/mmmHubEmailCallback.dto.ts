import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsObject, IsString} from 'class-validator';

class InfoBase {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email recepient',
    example: 'mduarte.10166.0749@sf.exacttargettest.com',
  })
  to: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identifier for the subscriber in MMM Hub (generally equal to "to")',
    example: 'mduarte.10166.0749@sf.exacttargettest.com',
  })
  subscriberKey: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Message identifier obtained when sending the email',
    example: 'c3896725-6847-40bd-9217-dda17ee6cba2',
  })
  messageKey: string;
}

class InfoSentEvent extends InfoBase {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Result of the Sent Event',
    example: 'Sent',
  })
  status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The subject line after personalization',
    example: "Don't Forget Your Appointment",
  })
  renderedSubject: string;
}

class InfoNotSentEvent extends InfoBase {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The descriptive reason',
    example: 'The subscriber ExactTarget system status is unsubscribed',
  })
  reason: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The subscriber error code',
    example: '1',
  })
  statusCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The subscriber error message',
    example: 'Unsubscribed',
  })
  statusMessage: string;
}

class InfoBouncedEvent extends InfoBase {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of bounce - "HARD" or "SOFT"',
    example: 'HARD',
  })
  bounceCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The string from the recipient email send the provider',
    example: '5.1.1 (bad destination mailbox address) User Unknown',
  })
  bounceMessage: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The error value of the SMTP reason',
    example: '5.1.1',
  })
  smtpReason: string;
}

export class MMMHubEmailCallbackDto {
  @IsObject()
  @IsNotEmpty()
  info: InfoNotSentEvent | InfoBouncedEvent | InfoSentEvent;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Event type',
    example: 'TransactionalSendEvents.EmailBounced',
  })
  eventCategoryType: string;
}

export class VerificationMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Callback ID',
    example: '65b885ab-c2b4-46fe-85d0-d6cb8be8057d',
  })
  callbackId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Verification key',
    example: 'CZwJw4XATH6LK1fPWFeMDkIyVbro6T3ijXK8CrzQe2s=\\',
  })
  verificationKey: string;
}
