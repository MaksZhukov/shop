import { Box } from '@mui/material';
import { pageApi } from 'entities/page';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { Benefits } from 'widgets/benefits';
import {
	MainSection,
	NewArrivals,
	BrandSelection,
	PopularCategories,
	CarsOnParts,
	CarBuyback,
	Articles
} from 'widgets/main';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { prefetchMainPage } from 'features/mainPage';

const Main: NextPage = () => {
	return (
		<Box sx={{ my: 4 }}>
			<MainSection />
			<Benefits view='grid' />
			<NewArrivals />
			<BrandSelection />
			<PopularCategories />
			<CarsOnParts />
			<CarBuyback />
			<Articles />
		</Box>
	);
};

export default Main;

export const getStaticProps = getPageProps(
	pageApi.fetchPage('main', {
		populate: ['seo']
	}),
	async () => {
		const queryClient = new QueryClient();
		await prefetchMainPage(queryClient);

		const dehydratedState = dehydrate(queryClient);

		return {
			props: {
				dehydratedState,
				breadcrumbs: []
			},
			revalidate: 60
		};
	}
);
