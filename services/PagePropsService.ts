import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';

export const getPageProps =
	<T>(
		fetchPage: () => Promise<AxiosResponse<ApiResponse<T>>>,
		...functions: ((context: any) => any)[]
	) =>
	async (context: any) => {
		let props = { data: { seo: {} } } as { data: T; [key: string]: any };
		try {
			const [response, ...restResponses] = await Promise.all([
				fetchPage(),
				...functions.map((func) => func(context)),
			]);
			restResponses.forEach((item) => {
				Object.keys(item).forEach((key) => {
					props[key] = item[key];
				});
			});
			props.data = response.data.data;
		} catch (err: any) {
			console.log(err.response);
		}
		return { props };
	};
