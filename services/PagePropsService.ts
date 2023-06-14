import { fetchBrands } from 'api/brands/brands';
import { API_UN_LIMIT } from 'api/constants';
import { fetchLayout } from 'api/layout/layout';
import { ApiResponse } from 'api/types';
import axios, { AxiosResponse } from 'axios';

export const getPageProps =
	<T>(fetchPage?: () => Promise<AxiosResponse<ApiResponse<T>>>, ...functions: ((context: any) => any)[]) =>
	async (context: any) => {
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
				...(fetchPage ? [fetchPage()] : []),
				...functions.map((func) => func(context))
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
