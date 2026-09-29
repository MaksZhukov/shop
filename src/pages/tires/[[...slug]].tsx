import { createModuleInjector } from 'shared/di';
import { TireWidthService } from 'entities/tireWidth';
import { TireHeightService } from 'entities/tireHeight';
import { TireDiameterService } from 'entities/tireDiameter';
import { TireService } from 'entities/tire';
import { createRequestContainer } from 'app/di/app.container';
import { PageService, type DefaultPage } from 'entities/page';
import { TireBrandService } from 'entities/tireBrand';
import { CatalogTires, TiresCatalogInjector } from 'features/catalog';
import { Filters } from 'features/productFilters';
import { FavoriteButton } from 'features/favorites';
import { CartButton } from 'features/cart';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { parseTiresSlug, buildTiresPageProps } from 'features/catalog';

interface Props {
	page: DefaultPage;
}

export const inject = createModuleInjector([
	TireService,
	TireBrandService,
	TireDiameterService,
	TireHeightService,
	TireWidthService
]);

const Tires: NextPage<Props> = ({ page }) => {
	const tireService = inject(TireService);
	const tireBrandService = inject(TireBrandService);
	const tireDiameterService = inject(TireDiameterService);
	const tireHeightService = inject(TireHeightService);
	const tireWidthService = inject(TireWidthService);
	return (
		<TiresCatalogInjector value={{ tireService, tireBrandService, tireDiameterService, tireHeightService, tireWidthService }}>
			<CatalogTires
				pageData={page}
				renderFilters={(props) => <Filters {...props} />}
				renderHeaderActions={(product) => <FavoriteButton product={product} />}
				renderBottomActions={(product) => (
					<CartButton product={product} sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }} />
				)}
			/>
		</TiresCatalogInjector>
	);
};

export default Tires;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	try {
		const { slug = [] } = context.query;
		const slugArray = slug as string[];
		const params = parseTiresSlug(slugArray);

		const container = createRequestContainer();
		const pageService = container.get(PageService);
		const tireBrandService = container.get(TireBrandService);
		const pageProps = await buildTiresPageProps(params, pageService, tireBrandService);
		if (!pageProps) return { props: {}, notFound: true };

		return { props: { ...pageProps } };
	} catch {
		return { props: {}, notFound: true };
	}
});
