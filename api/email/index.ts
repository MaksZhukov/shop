import { api } from 'api';

export const send = (subject: string, html: string, to?: string) => api.post('/email', { to, subject, html });
