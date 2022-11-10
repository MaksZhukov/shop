import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageAwaitingCars } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageAwaitingCars = () =>
	api.get<ApiResponse<PageAwaitingCars>>(`/page-awaiting-car`, {
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
	});
