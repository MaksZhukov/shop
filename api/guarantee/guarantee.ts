import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { Guarantee } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchGuarantee = () =>
	api.get<ApiResponse<Guarantee>>(`/guarantee`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
