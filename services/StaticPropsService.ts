import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';

export const getStaticPageProps =
	<T>(
		fetchPage: () => Promise<AxiosResponse<ApiResponse<T>>>,
		...functions: (() => any)[]
	) =>
	async () => {
		let props = { data: { seo: {} } } as { data: T; [key: string]: any };
		try {
			const [response, ...restResponses] = await Promise.all([
				fetchPage(),
				...functions.map((func) => func()),
			]);
			restResponses.forEach((item) => {
				let key = Object.keys(item)[0];
				props[key] = item[key];
			});
			props.data = response.data.data;
		} catch (err) {
			console.log(err);
		}
		return { props };
	};
