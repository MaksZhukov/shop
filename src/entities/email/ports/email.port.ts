import type { EmailApi } from '../email.api';

export type EmailReader = Pick<EmailApi, 'send'>;
