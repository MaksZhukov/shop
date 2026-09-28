import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';

export const EMAIL_API = Symbol('EmailApi');

@injectable()
export class EmailApi {
	send(subject: string, html: string, to?: string) {
		return api.post('/email', { to, subject, html });
	}
}

export const emailApi = new EmailApi();

