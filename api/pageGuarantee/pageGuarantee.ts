import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageGuarantee } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageGuarantee = () =>
	api.get<ApiResponse<PageGuarantee>>(`/page-guarantee`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
