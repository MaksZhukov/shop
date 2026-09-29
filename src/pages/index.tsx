import { Box } from '@mui/material';
import { PageService } from 'entities/page';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { Benefits, BenefitsInjector } from 'features/benefits';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { createRequestContainer } from 'app/di/app.container';
import { ArticleService } from 'entities/article';
import { BrandService } from 'entities/brand';
import { CarOnPartsService } from 'entities/carOnParts';
import { SparePartService } from 'entities/sparePart';
import { EngineVolumeService } from 'entities/engineVolume';
import { GenerationService } from 'entities/generation';
import { KindSparePartService } from 'entities/kindSparePart';
import { ModelService } from 'entities/model';
import { createModuleInjector } from 'shared/di';
import {
	MainSection,
	NewArrivals,
	BrandSelection,
	PopularCategories,
	CarsOnParts,
	CarBuyback,
	Articles,
	MainPageInjector,
	prefetchMainPage
} from 'features/mainPage';

export const inject = createModuleInjector([
	ArticleService,
	BrandService,
	CarOnPartsService,
	EngineVolumeService,
	GenerationService,
	KindSparePartService,
	ModelService,
	SparePartService
]);

const Main: NextPage = () => {
	const articleService = inject(ArticleService);
	const brandService = inject(BrandService);
	const carOnPartsService = inject(CarOnPartsService);
	const engineVolumeService = inject(EngineVolumeService);
	const generationService = inject(GenerationService);
	const kindSparePartService = inject(KindSparePartService);
	const modelService = inject(ModelService);
	const sparePartService = inject(SparePartService);

	return (
		<MainPageInjector
			value={{
				articleService,
				brandService,
				carOnPartsService,
				engineVolumeService,
				generationService,
				kindSparePartService,
				modelService,
				sparePartService
			}}
		>
			<BenefitsInjector value={{ sparePartService }}>
				<Box sx={{ my: 4 }}>
					<MainSection />
					<Benefits view='grid' />
					<NewArrivals
						renderHeaderActions={(product) => <FavoriteButton product={product} />}
						renderBottomActions={(product) => (
							<CartButton product={product} sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }} />
						)}
					/>
					<BrandSelection />
					<PopularCategories />
					<CarsOnParts />
					<CarBuyback />
					<Articles />
				</Box>
			</BenefitsInjector>
		</MainPageInjector>
	);
};

export default Main;

export const getStaticProps = getPageProps(undefined, async () => {
	const container = createRequestContainer();
	const pageService = container.get(PageService);
	const page = (await pageService.fetchPage('main', { populate: ['seo'] })()).data.data;
	const queryClient = new QueryClient();
	await prefetchMainPage(
		queryClient,
		container.get(ArticleService),
		container.get(BrandService),
		container.get(SparePartService),
		container.get(CarOnPartsService)
	);

	return {
		props: {
			page,
			dehydratedState: dehydrate(queryClient),
			breadcrumbs: []
		},
		revalidate: 60
	};
});
