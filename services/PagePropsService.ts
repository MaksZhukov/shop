import { fetchBrands } from 'api/brands/brands';
import { API_UN_LIMIT } from 'api/constants';
import { fetchLayout } from 'api/layout/layout';
import { ApiResponse } from 'api/types';
import axios, { AxiosResponse } from 'axios';
import { UAParser } from 'ua-parser-js';

export const getPageProps =
	<T>(
		fetchPage?: (context: any, deviceType: 'desktop' | 'mobile') => Promise<AxiosResponse<ApiResponse<T>>>,
		...functions: ((context: any, deviceType: 'desktop' | 'mobile') => any)[]
	) =>
	async (context: any) => {
		const ua = context?.req?.headers['user-agent'];
		const deviceType = ua ? UAParser(ua).device.type : 'desktop';
		const deviceTypeResult = deviceType === 'mobile' || deviceType === 'tablet' ? 'mobile' : 'desktop';
		let props = { brands: [], page: { seo: {} }, layout: { footer: {} } } as {
			layout: { footer: any };
			[key: string]: any;
		};
		try {
			const [brandsResponse, layoutResponse, response, ...restResponses] = await Promise.all([
				fetchBrands({
					populate: ['seo.images', 'image'],
					sort: 'name',
					pagination: { limit: API_UN_LIMIT },
					filters: {
						spareParts: {
							id: {
								$notNull: true
							}
						}
					}
				}),
				fetchLayout(),
				...(fetchPage ? [fetchPage(context, deviceTypeResult)] : []),
				...functions.map((func) => func(context, deviceTypeResult))
			]);
			[...(fetchPage ? restResponses : response ? [response, ...restResponses] : [...restResponses])].forEach(
				(item) => {
					Object.keys(item).forEach((key) => {
						props[key] = item[key];
					});
				}
			);
			if (fetchPage) {
				props.page = response.data.data;
			}
			props.brands = brandsResponse.data.data;
			props.layout = layoutResponse.data.data;
		} catch (err: any) {
			if (!axios.isAxiosError(err)) {
				console.log(err);
			}
			if (err?.response?.status === 404) {
				return { redirect: { destination: '/404' } };
			}
			if (err?.response?.status === 500) {
				return { redirect: { destination: '/500' } };
			}
		}
		return { props };
	};
