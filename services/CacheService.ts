import { OneNews } from 'api/news/types';
import { AxiosResponse } from 'axios';

const cache: {
	apiNews: AxiosResponse<{
		items: OneNews[];
	}> | null;
} = {
	apiNews: null,
};

export default cache;
