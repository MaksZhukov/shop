import { api } from '..';
import { CollectionParams } from 'api/types';

export const getArticles = (params: CollectionParams) =>
	api.get('/articles', { params });
