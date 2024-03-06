import { Box, useMediaQuery } from '@mui/material';
import { fetchBrandBySlug } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchModelBySlug } from 'api/models/models';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductWheel } from 'api/pages/types';
import { Wheel } from 'api/wheels/types';
import { fetchWheel, fetchWheels } from 'api/wheels/wheels';
import CatalogWheels from 'components/CatalogWheels';
import Product from 'components/Product';
import Typography from 'components/Typography/Typography';
import type { NextPage } from 'next';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { withKindSparePart } from 'services/SEOService';
import { getStringByTemplateStr } from 'services/StringService';
import qs from 'query-string';
const { publicRuntimeConfig } = getConfig();

const BrandsCarousel = dynamic(() => import('components/BrandsCarousel'));
const CarouselReviews = dynamic(() => import('components/CarouselReviews'));

interface Props {
	data?: Wheel;
	relatedProducts?: Wheel[];
	page: DefaultPage | (PageProduct & PageProductWheel);
	brands: Brand[];
	setRenderBeforeFooter: (element: ReactElement | null) => void;
}

const Wheels: NextPage<Props> = ({ page, brands, data, relatedProducts, setRenderBeforeFooter }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	useEffect(() => {
		setRenderBeforeFooter(
			<Box marginY='1em' paddingX='1em'>
				<BrandsCarousel linkType='wheels' brands={brands}></BrandsCarousel>
				<Typography component='h3' marginTop='1em' variant={isMobile ? 'h6' : 'h5'}>
					Отзывы о нас
				</Typography>
				<CarouselReviews marginBottom='1em' slidesToShow={isMobile ? 1 : isTablet ? 2 : 4}></CarouselReviews>
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
					{ text: 'Тип', value: data.kind },
					{ text: 'Количество', value: data.count },
					{ text: 'Марка', value: data.brand?.name },
					{ text: 'Модель', value: data.model?.name },
					{ text: 'R Диаметр', value: data.diameter?.name },
					{ text: 'J Ширина', value: data.width?.name },
					{ text: 'Количество отверстий', value: data.numberHoles?.name },
					{ text: 'PCD расстояние между отверстиями', value: data.numberHoles?.name },
					{
						text: 'DIA диаметр центрального отверстия',
						value: data.diameterCenterHole?.name
					},
					{
						text: 'ET вылет',
						value: data.diskOffset?.name
					}
				]}
				page={page as PageProduct & PageProductWheel}
				relatedProducts={relatedProducts}
			></Product>
		);
	}
	return <CatalogWheels page={page} brands={brands}></CatalogWheels>;
};

export default Wheels;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const { slug = [], kindSparePart } = context.query;
	const [brand, modelOrProductParam] = slug;
	const productParam =
		modelOrProductParam && !modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
	const modelParam = modelOrProductParam && modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
	let props: any = {};

	if (productParam) {
		// if (brand.toLowerCase() === 'undefined') {
		//     throw new AxiosError(undefined, undefined, undefined, undefined, {
		//         statusText: '',
		//         config: { headers: new AxiosHeaders() },
		//         headers: {},
		//         data: {},
		//         status: 404
		//     });
		// } else {
		const response = await fetch(
			qs.stringifyUrl({
				url: publicRuntimeConfig.backendUrl + `/api/wheels/${productParam}`,
				query: {
					populate: [
						'images',
						'model',
						'brand.productBrandTexts.wheelTextBrand',
						'seo.images',
						'snippets',
						'diskOffset',
						'width',
						'numberHoles',
						'diameter',
						'diameterCenterHole',
						'distanceBetweenCenters',
						'order'
					]
				}
			}),
			{ cache: 'no-store' }
		);
		const { data } = await response.json();
		const [
			// {
			// 	data: { data }
			// },
			{
				data: { data: page }
			},
			{
				data: { data: pageWheel }
			}
		] = await Promise.all([
			// fetchWheel(productParam),
			fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
			fetchPage<PageProductWheel>('product-wheel', { populate: ['seo'] })()
		]);
		const {
			data: { data: relatedProducts }
		} = await fetchWheels({
			filters: {
				sold: false,
				id: {
					$ne: data.id
				},
				model: data.model?.id || ''
			},
			populate: ['images', 'brand']
		});
		props = {
			data,
			page: {
				...page,
				...pageWheel,
				additionalDescription: getStringByTemplateStr(pageWheel.additionalDescription, data),
				seo: getProductPageSeo(pageWheel.seo, data)
			},
			relatedProducts
		};
		// }
	} else if (modelParam) {
		let model = modelParam.replace('model-', '');
		const {
			data: { data }
		} = await fetchModelBySlug(model, {
			populate: ['seoWheels.images', 'image'],
			filters: { brand: { slug: brand } }
		});
		props = { page: { seo: withKindSparePart(data.seoWheels, 'диски', kindSparePart) } };
	} else if (brand) {
		const {
			data: { data }
		} = await fetchBrandBySlug(brand, {
			populate: ['seoWheels.images', 'image']
		});
		props = { page: { seo: withKindSparePart(data.seoWheels, 'диски', kindSparePart) } };
	} else {
		const {
			data: { data }
		} = await fetchPage('wheel')();
		props = { page: { seo: withKindSparePart(data.seo, 'диски', kindSparePart) } };
	}
	return props;
});
