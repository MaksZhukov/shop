import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageContacts } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageContacts = () =>
	api.get<ApiResponse<PageContacts>>(`/page-contact`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
