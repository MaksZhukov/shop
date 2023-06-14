import { Box } from '@mui/material';
import { Brand } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductTire } from 'api/pages/types';
import { fetchTireBrandBySlug, fetchTireBrands } from 'api/tireBrands/tireBrands';
import { TireBrand } from 'api/tireBrands/types';
import { fetchTire, fetchTires } from 'api/tires/tires';
import { Tire } from 'api/tires/types';
import { SEO } from 'api/types';
import BrandsSlider from 'components/BrandsSlider/BrandsSlider';
import CatalogTires from 'components/CatalogTires';
import Product from 'components/Product';
import type { NextPage } from 'next';
import { ReactElement, useEffect } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { getStringByTemplateStr } from 'services/StringService';

interface Props {
	data?: Tire;
	relatedProducts?: Tire[];
	page: DefaultPage | (PageProduct & PageProductTire);
	tireBrands: TireBrand[];
	brands: Brand[];
	setRenderBeforeFooter: (element: ReactElement | null) => void;
}

const Tires: NextPage<Props> = ({ page, tireBrands, data, relatedProducts, brands, setRenderBeforeFooter }) => {
	console.log(tireBrands);
	useEffect(() => {
		setRenderBeforeFooter(
			<Box marginY='1em' paddingX='1em'>
				<BrandsSlider linkType='tires' brands={tireBrands}></BrandsSlider>
			</Box>
		);
		return () => {
			setRenderBeforeFooter(null);
		};
	}, []);

	if (data && relatedProducts) {
		return (
			<Product
				brands={brands}
				data={data}
				printOptions={[
					{ text: 'Артикул', value: data.id },
					{ text: 'Количество', value: data.count },
					{ text: 'Марка', value: data.brand?.name },
					{ text: 'Диаметр', value: data.diameter?.name },
					{ text: 'Высота', value: data.height?.name },
					{ text: 'Ширина', value: data.width?.name },
					{ text: 'Сезон', value: data.season }
				]}
				page={page as PageProduct & PageProductTire}
				relatedProducts={relatedProducts}
			></Product>
		);
	}
	return <CatalogTires page={page} tireBrands={tireBrands}></CatalogTires>;
};

export default Tires;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const { slug } = context.query;
	let tireBrands: TireBrand[] = [];
	const brandParam = slug ? slug[0] : undefined;
	const productSlugParam = slug ? slug[1] : undefined;
	let seo: SEO | null = null;
	let props: any = {};
	if (productSlugParam) {
		// if (brandParam.toLowerCase() === 'undefined') {
		//     throw new AxiosError(undefined, undefined, undefined, undefined, {
		//         statusText: '',
		//         config: { headers: new AxiosHeaders() },
		//         headers: {},
		//         data: {},
		//         status: 404
		//     });
		// } else {
		const [
			{
				data: { data }
			},
			{
				data: { data: page }
			},
			{
				data: { data: pageTire }
			},
			{
				data: { data: tireBrandsData }
			}
		] = await Promise.all([
			fetchTire(productSlugParam),
			fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
			fetchPage<PageProductTire>('product-tire', { populate: ['seo'] })(),
			fetchTireBrands({
				pagination: { limit: API_MAX_LIMIT },
				populate: ['image']
			})
		]);
		const {
			data: { data: relatedProducts }
		} = await fetchTires({
			filters: {
				sold: { $eq: false },
				id: {
					$ne: data.id
				},
				brand: data.brand?.id
			},
			populate: ['images', 'brand']
		});
		props = {
			data,
			page: {
				...page,
				...pageTire,
				additionalDescription: getStringByTemplateStr(pageTire.additionalDescription, data),
				seo: getProductPageSeo(pageTire.seo, data)
			},
			tireBrands: tireBrandsData,
			relatedProducts
		};
		// }
	} else if (brandParam) {
		const [
			{
				data: { data }
			},
			{
				data: { data: tireBrandsData }
			}
		] = await Promise.all([
			fetchTireBrandBySlug(brandParam, { populate: ['seo.images', 'image'] }),
			fetchTireBrands({
				pagination: { limit: API_MAX_LIMIT },
				populate: ['image']
			})
		]);
		props = { page: { seo: data.seo }, tireBrands: tireBrandsData };
	} else {
		const [
			{
				data: { data }
			},
			{
				data: { data: tireBrandsData }
			}
		] = await Promise.all([
			fetchPage('tire')(),
			fetchTireBrands({
				pagination: { limit: API_MAX_LIMIT },
				populate: ['image']
			})
		]);
		props = { page: { seo: data.seo }, tireBrands: tireBrandsData };
	}
	return props;
});
