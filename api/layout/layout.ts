import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { getRandomBackendLocalUrl } from 'services/BackendUrlService';
import { Layout } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchLayout = () =>
	api.get<ApiResponse<Layout>>(`/layout`, {
		params: { populate: ['footer.socials.image', 'videoWidget.video'] },
		baseURL: getRandomBackendLocalUrl() + '/api'
	});
