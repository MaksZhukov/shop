import { Box, useMediaQuery } from '@mui/material';
import { fetchBrandBySlug } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchCabin, fetchCabins } from 'api/cabins/cabins';
import { Cabin } from 'api/cabins/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModelBySlug } from 'api/models/models';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductCabin } from 'api/pages/types';
import CatalogCabins from 'components/CatalogCabins/CatalogCabins';
import Product from 'components/Product/Product';
import Typography from 'components/Typography/Typography';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { withKindSparePart } from 'services/SEOService';
import { getStringByTemplateStr } from 'services/StringService';

const BrandsCarousel = dynamic(() => import('components/BrandsCarousel'));
const CarouselReviews = dynamic(() => import('components/CarouselReviews'));

interface Props {
	data: Cabin;
	relatedProducts: Cabin[];
	page: DefaultPage | (PageProduct & PageProductCabin);
	brands: Brand[];
	kindSparePart?: KindSparePart;
	setRenderBeforeFooter: (element: ReactElement | null) => void;
}

const Cabins: NextPage<Props> = ({ page, brands, data, relatedProducts, kindSparePart, setRenderBeforeFooter }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	useEffect(() => {
		setRenderBeforeFooter(
			<>
				<Box marginY='1em' paddingX='1em'>
					<BrandsCarousel linkType='cabins' brands={brands}></BrandsCarousel>
					<Typography component='h3' marginTop='1em' variant={isMobile ? 'h6' : 'h5'}>
						Отзывы о нас
					</Typography>
					<CarouselReviews
						marginBottom='1em'
						slidesToShow={isMobile ? 1 : isTablet ? 2 : 4}
					></CarouselReviews>
				</Box>
			</>
		);
		return () => {
			setRenderBeforeFooter(null);
		};
	}, []);
	if (data) {
		return (
			<Product
				brands={brands}
				data={data}
				printOptions={[
					{ text: 'Артикул', value: data.id },
					{ text: 'Марка', value: data.brand?.name },
					{ text: 'Модель', value: data.model?.name },
					{ text: 'Поколение', value: data.generation?.name },
					{ text: 'Год', value: data.year },
					{ text: 'Запчасть', value: data.kindSparePart?.name },
					...(data.seatUpholstery ? [{ text: 'Обивка сидений', value: data.seatUpholstery }] : [])
				]}
				page={page as PageProduct & PageProductCabin}
				relatedProducts={relatedProducts}
			></Product>
		);
	}
	return <CatalogCabins page={page} brands={brands} kindSparePart={kindSparePart}></CatalogCabins>;
};

export default Cabins;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const { slug = [], kindSparePart: kindSparePartSlug } = context.query;
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
		const [
			{
				data: { data }
			},
			{
				data: { data: page }
			},
			{
				data: { data: pageCabin }
			}
		] = await Promise.all([
			fetchCabin(productParam),
			fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
			fetchPage<PageProductCabin>('product-cabin', { populate: ['seo'] })()
		]);
		const {
			data: { data: relatedProducts }
		} = await fetchCabins({
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
				...pageCabin,
				additionalDescription: getStringByTemplateStr(pageCabin.additionalDescription, data),
				seo: getProductPageSeo(pageCabin.seo, data)
			},
			relatedProducts
		};
		// }
	} else if (modelParam) {
		let model = modelParam.replace('model-', '');
		const [
			{
				data: { data }
			},
			resultKindSpareParts
		] = await Promise.all([
			fetchModelBySlug(model, {
				populate: ['seoCabins.images', 'image'],
				filters: { brand: { slug: brand } }
			}),
			...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
		]);
		const kindSparePart = resultKindSpareParts?.data?.data[0];
		props = {
			page: { seo: withKindSparePart(data.seoCabins, 'салоны', kindSparePart?.name) },
			...(kindSparePart ? { kindSparePart } : {})
		};
	} else if (brand) {
		const [
			{
				data: { data }
			},
			resultKindSpareParts
		] = await Promise.all([
			fetchBrandBySlug(brand, {
				populate: ['seoCabins.images', 'image']
			}),
			...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
		]);
		const kindSparePart = resultKindSpareParts?.data?.data[0];
		props = {
			page: { seo: withKindSparePart(data.seoCabins, 'салоны', kindSparePart?.name) },
			...(kindSparePart ? { kindSparePart } : {})
		};
	} else {
		const [
			{
				data: { data }
			},
			resultKindSpareParts
		] = await Promise.all([
			fetchPage('cabin')(),
			...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
		]);
		const kindSparePart = resultKindSpareParts?.data?.data[0];
		props = {
			page: { seo: withKindSparePart(data.seo, 'салоны', kindSparePart?.name) },
			...(kindSparePart ? { kindSparePart } : {})
		};
	}
	return props;
});
