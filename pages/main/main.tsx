import { Box } from '@mui/material';
import { Brand } from 'api/brands/types';
import { SparePart } from 'api/spareParts/types';
import { CarOnParts } from 'api/cars-on-parts/types';
import { Article } from 'api/articles/types';
import { PageMain } from 'api/pages/types';
import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchPage } from 'api/pages';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { fetchArticles } from 'api/articles/articles';
import { fetchBrands } from 'api/brands/brands';
import {
	MainSection,
	Benefits,
	NewArrivals,
	BrandSelection,
	PopularCategories,
	CarsOnParts,
	CarBuyback,
	Articles
} from './components';

interface Props {
	page: PageMain;
	brands: Brand[];
	newSpareParts: SparePart[];
	carsOnParts: CarOnParts[];
	articles: Article[];
	sparePartsTotal: number;
}

const Main: NextPage<Props> = ({ page, brands, newSpareParts, carsOnParts, articles, sparePartsTotal }) => {
	return (
		<Box sx={{ my: 4 }}>
			<MainSection brands={brands} sparePartsTotal={sparePartsTotal} />
			<Benefits sparePartsTotal={sparePartsTotal} />
			<NewArrivals newSpareParts={newSpareParts} />
			<BrandSelection brands={brands} />
			<PopularCategories />
			<CarsOnParts carsOnParts={carsOnParts} />
			<CarBuyback />
			<Articles articles={articles} />
		</Box>
	);
};

export default Main;

export const getServerSideProps = getPageProps(
	fetchPage('main', {
		populate: [
			'seo',
			'benefits.image',
			'categoryImages',
			'banner',
			'bannerMobile',
			'benefitsRightImage',
			'autocomises.image',
			'serviceStations.image'
		]
	}),
	async () => ({
		brands: (
			await fetchBrands({
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
		).data.data
	}),
	async () => ({
		newSpareParts: (
			await fetchSpareParts({
				populate: ['images', 'brand', 'volume'],
				pagination: { limit: 10 }
			})
		).data.data
	}),
	async (ctx: any, deviceType: 'desktop' | 'mobile') => ({
		articles: (
			await fetchArticles({
				populate: ['mainImage'],
				sort: ['createdAt:desc'],
				pagination: { limit: deviceType === 'mobile' ? 5 : 8 }
			})
		).data.data
	}),
	async () => ({
		carsOnParts: (
			await fetchCarsOnParts({
				populate: ['images', 'volume', 'brand', 'model', 'generation'],
				pagination: { limit: 10 }
			})
		).data.data
	}),
	async () => ({
		sparePartsTotal:
			(
				await fetchSpareParts({
					pagination: { limit: 0 },
					filters: {
						sold: false
					}
				})
			).data.meta?.pagination?.total || 0
	})
);
