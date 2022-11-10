import { ApiResponse } from 'api/types';
import { AxiosResponse } from 'axios';

export const getStaticSeoProps =
	<T>(fetchPage: () => Promise<AxiosResponse<ApiResponse<T>>>) =>
	async () => {
		let data = { seo: {} } as T;
		try {
			const response = await fetchPage();
			data = response.data.data;
		} catch (err) {
			console.log(err);
		}
		return { props: { data } };
	};
