import type { QueryClient } from '@tanstack/react-query';
import { API_MAX_LIMIT } from 'shared/api/constants';
import type { BrandService } from 'entities/brand';
import type { SparePartService } from 'entities/sparePart';
import type { ArticleReader } from 'entities/article';
import type { CarOnPartsService } from 'entities/carOnParts';
import { mainPageQueryKeys } from './config';

export const mainPageQueryFns = {
	brands: (brandService: BrandService) =>
		brandService
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
	newSpareParts: (sparePartService: SparePartService) =>
		sparePartService
			.fetchSpareParts({
				populate: ['images', 'brand', 'volume'],
				pagination: { limit: 10 },
				filters: { sold: false },
				sort: ['createdAt:desc']
			})
			.then((r) => r.data),
	articles: (articleReader: ArticleReader) =>
		articleReader.fetchArticles({
			populate: ['mainImage'],
			sort: ['createdAt:desc'],
			pagination: { limit: 8 }
		}),
	carsOnParts: (carOnPartsService: CarOnPartsService) =>
		carOnPartsService
			.fetchCarsOnParts({
				populate: ['images', 'volume', 'brand', 'model', 'generation'],
				pagination: { limit: 10 }
			})
			.then((r) => r.data),
	sparePartsTotal: (sparePartService: SparePartService) =>
		sparePartService
			.fetchSpareParts({
				pagination: { limit: 0 },
				filters: { sold: false }
			})
			.then((r) => r.data)
};

export const prefetchMainPage = async (
	queryClient: QueryClient,
	articleReader: ArticleReader,
	brandService: BrandService,
	sparePartService: SparePartService,
	carOnPartsService: CarOnPartsService
): Promise<void> => {
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.brands(),
			queryFn: () => mainPageQueryFns.brands(brandService)
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.newSpareParts(),
			queryFn: () => mainPageQueryFns.newSpareParts(sparePartService)
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.articles(),
			queryFn: () => mainPageQueryFns.articles(articleReader)
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.carsOnParts(),
			queryFn: () => mainPageQueryFns.carsOnParts(carOnPartsService)
		}),
		queryClient.prefetchQuery({
			queryKey: mainPageQueryKeys.sparePartsTotal(),
			queryFn: () => mainPageQueryFns.sparePartsTotal(sparePartService)
		})
	]);
};
