import type { QueryClient } from '@tanstack/react-query';
import { API_MAX_LIMIT } from 'shared/api/constants';
import { brandApi } from 'entities/brand';
import { sparePartApi } from 'entities/sparePart';
import { articlesApi } from 'entities/article';
import { carOnPartsApi } from 'entities/carOnParts';
import { mainPageQueryKeys } from './config';

export const mainPageQueryFns = {
	brands: () =>
		brandApi
			.fetchBrands({
				populate: ['image'],
				sort: 'name',
				filters: {
					spareParts: {
						id: {
							$notNull: true
						}
					}
				},
				pagination: { limit: API_MAX_LIMIT }
			})
			.then((r) => r.data),
	newSpareParts: () =>
		sparePartApi
			.fetchSpareParts({
				populate: ['images', 'brand', 'volume'],
				pagination: { limit: 10 },
				filters: { sold: false }
			})
			.then((r) => r.data),
	articles: () =>
		articlesApi
			.fetchArticles({
				populate: ['mainImage'],
				sort: ['createdAt:desc'],
				pagination: { limit: 8 }
			})
			.then((r) => r.data),
	carsOnParts: () =>
		carOnPartsApi
			.fetchCarsOnParts({
				populate: ['images', 'volume', 'brand', 'model', 'generation'],
				pagination: { limit: 10 }
			})
			.then((r) => r.data),
	sparePartsTotal: () =>
		sparePartApi
			.fetchSpareParts({
				pagination: { limit: 0 },
				filters: { sold: false }
			})
			.then((r) => r.data)
};

export const prefetchMainPage = async (queryClient: QueryClient): Promise<void> => {
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.brands(),
			queryFn: mainPageQueryFns.brands
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.newSpareParts(),
			queryFn: mainPageQueryFns.newSpareParts
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.articles(),
			queryFn: mainPageQueryFns.articles
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.carsOnParts(),
			queryFn: mainPageQueryFns.carsOnParts
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.sparePartsTotal(),
			queryFn: mainPageQueryFns.sparePartsTotal
		})
	]);
};
