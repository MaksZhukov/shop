import { api } from 'api';
import { ApiResponse } from 'api/types';
import { getRandomBackendLocalUrl } from 'services/BackendUrlService';
import { Layout } from './types';

export const fetchLayout = () =>
	api.get<ApiResponse<Layout>>(`/layout`, {
		params: { populate: ['footer.socials.image', 'videoWidget.video'] },
		baseURL: getRandomBackendLocalUrl() + '/api'
	});
