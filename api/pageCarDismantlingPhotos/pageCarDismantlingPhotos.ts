import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { PageCarDismantlingPhotos } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchPageCarDismantlingPhotos = () =>
	api.get<ApiResponse<PageCarDismantlingPhotos>>(
		`/page-car-dismantling-photo`,
		{
			baseURL: publicRuntimeConfig.backendLocalUrl + '/api',
		}
	);
