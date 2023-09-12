import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import { Layout } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchLayout = () =>
	api.get<ApiResponse<Layout>>(`/layout`, {
		params: { populate: ['footer.socials.image', 'videoWidget.video'] },
		baseURL: publicRuntimeConfig.backendLocalUrl + '/api'
	});
