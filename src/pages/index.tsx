import { Box } from '@mui/material';
import type { Brand } from 'entities/brand/brandTypes';
import type { SparePart } from 'entities/sparePart';
import type { CarOnParts } from 'entities/carOnParts';
import type { Article } from 'entities/article/articleTypes';
import { pageApi } from 'entities/page';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { API_MAX_LIMIT } from 'shared/api/constants';
import { sparePartApi } from 'entities/sparePart';
import { carOnPartsApi } from 'entities/carOnParts';
import { articlesApi } from 'entities/article';
import { brandApi } from 'entities/brand';
import {
	MainSection,
	Benefits,
	NewArrivals,
	BrandSelection,
	PopularCategories,
	CarsOnParts,
	CarBuyback,
	Articles
} from 'widgets/main';
import { useDeviceType } from 'shared/hooks/useDeviceType';

interface Props {
	brands: Brand[];
	newSpareParts: SparePart[];
	carsOnParts: CarOnParts[];
	articles: Article[];
	sparePartsTotal: number;
}

const Main: NextPage<Props> = ({ brands, newSpareParts, carsOnParts, articles, sparePartsTotal }) => {
	const deviceType = useDeviceType();
	const articlesLimit = deviceType === 'mobile' ? 5 : 8;
	const articlesToShow = articles.slice(0, articlesLimit);
	return (
		<Box sx={{ my: 4 }}>
			<MainSection brands={brands} sparePartsTotal={sparePartsTotal} />
			<Benefits sparePartsTotal={sparePartsTotal} view='grid' />
			<NewArrivals newSpareParts={newSpareParts} />
			<BrandSelection brands={brands} />
			<PopularCategories />
			<CarsOnParts carsOnParts={carsOnParts} />
			<CarBuyback />
			<Articles articles={articlesToShow} />
		</Box>
	);
};

export default Main;

export const getStaticProps = getPageProps(
	pageApi.fetchPage('main', {
		populate: ['seo']
	}),
	async (context, deviceType) => {
		const [brands, newSpareParts, articles, carsOnParts, sparePartsTotal] = await Promise.all([
			brandApi.fetchBrands({
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
			}),
			sparePartApi.fetchSpareParts({
				populate: ['images', 'brand', 'volume'],
				pagination: { limit: 10 }
			}),
			articlesApi.fetchArticles({
				populate: ['mainImage'],
				sort: ['createdAt:desc'],
				pagination: { limit: 8 }
			}),
			carOnPartsApi.fetchCarsOnParts({
				populate: ['images', 'volume', 'brand', 'model', 'generation'],
				pagination: { limit: 10 }
			}),
			sparePartApi.fetchSpareParts({
				pagination: { limit: 0 },
				filters: {
					sold: false
				}
			})
		]);

		return {
			props: {
				brands: brands.data.data,
				newSpareParts: newSpareParts.data.data,
				articles: articles.data.data,
				carsOnParts: carsOnParts.data.data,
				sparePartsTotal: sparePartsTotal.data.meta?.pagination?.total || 0,
				breadcrumbs: []
			},
			revalidate: 60
		};
	}
);
