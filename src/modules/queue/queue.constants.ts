/**
 * The main Email Queue which is processed every minute and dispatches actions to Sendgrid immediately
 * Use this queue if you want to send your email almost in real time
 */

export const EMAIL_MESSAGE_QUEUE_NAME = 'emailQueue';
