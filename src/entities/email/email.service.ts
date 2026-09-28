import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { EMAIL_API, EmailApi } from './email.api';
import type { EmailReader } from './ports/email.port';

@injectable()
export class EmailService implements EmailReader {
	constructor(@inject(EMAIL_API) private readonly emailApi: EmailApi) {}

	send(subject: string, html: string, to?: string) {
		return this.emailApi.send(subject, html, to);
	}
}
