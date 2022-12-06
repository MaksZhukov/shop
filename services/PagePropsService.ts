import { fetchLayout } from 'api/layout/layout';
import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';

export const getPageProps =
	<T>(fetchPage?: () => Promise<AxiosResponse<ApiResponse<T>>>, ...functions: ((context: any) => any)[]) =>
	async (context: any) => {
		let props = { data: { seo: {} } } as { data: T; [key: string]: any };
		try {
			const [layoutResponse, response, ...restResponses] = await Promise.all([
				fetchLayout(),
				...(fetchPage ? [fetchPage()] : []),
				...functions.map((func) => func(context)),
			]);
			[...(fetchPage ? restResponses : [response, ...restResponses])].forEach((item) => {
				Object.keys(item).forEach((key) => {
					props[key] = item[key];
				});
			});
			if (fetchPage) {
				props.page = response.data.data;
			}
			props.layout = layoutResponse.data.data;
		} catch (err: any) {
			console.log(err.response);
		}
		return { props };
	};
