import { OneNews as OneNewsApi } from '../../pages/api/news';
export type OneNews = Omit<OneNewsApi, 'author' | 'categories' | 'content'> & {
	imageUrl: string;
};
