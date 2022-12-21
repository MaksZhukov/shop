import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { Autocomis } from 'api/autocomises/types';
import { fetchBrands } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { ServiceStation } from 'api/serviceStations/types';
import { ApiResponse, LinkWithImage } from 'api/types';
import CatalogCars from 'components/CatalogCars';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: DefaultPage;
	articles: Article[];
	advertising: LinkWithImage[];
	autocomises: Autocomis[];
	deliveryAuto: LinkWithImage;
	serviceStations: ServiceStation[];
	discounts: LinkWithImage[];
	brands: Brand[];
}

const CarsOnParts: NextPage<Props> = ({
	page,
	articles,
	autocomises,
	advertising,
	deliveryAuto,
	discounts,
	brands,
	serviceStations,
}) => {
	return (
		<CatalogCars
			page={page}
			articles={articles}
			autocomises={autocomises}
			advertising={advertising}
			deliveryAuto={deliveryAuto}
			discounts={discounts}
			brands={brands}
			serviceStations={serviceStations}
			fetchCarsApi={fetchCarsOnParts}
		></CatalogCars>
	);
};

export default CarsOnParts;

export const getServerSideProps = getPageProps(
	fetchPage('cars-on-part'),
	async () => {
		const {
			data: {
				data: { advertising, deliveryAuto, discounts, autocomises, serviceStations },
			},
		} = await fetchPage<PageMain>('main')();
		return {
			advertising,
			deliveryAuto,
			autocomises,
			serviceStations,
			discounts,
		};
	},
	async () => ({
		articles: (await fetchArticles({ populate: 'image' })).data.data,
	}),
	async () => ({
		brands: (
			await fetchBrands({
				populate: 'image',
				pagination: { limit: MAX_LIMIT },
			})
		).data.data,
	})
);
