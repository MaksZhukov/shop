import { api } from 'shared/api';

export const emailApi = {
	send: (subject: string, html: string, to?: string) => api.post('/email', { to, subject, html })
};



