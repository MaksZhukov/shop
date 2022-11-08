import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { Contact } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchContact = () =>
	api.get<ApiResponse<Contact>>(`/contact`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
