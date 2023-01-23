import { api } from 'api';

export const send = (subject: string, html: string) => api.post('/email', { data: { subject, html } });
