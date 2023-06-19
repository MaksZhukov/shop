import { Box } from '@mui/material';
import { fetchBrandBySlug } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModelBySlug } from 'api/models/models';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductSparePart } from 'api/pages/types';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import BrandsCarousel from 'components/BrandsCarousel';
import CatalogSpareParts from 'components/CatalogSpareParts';
import Product from 'components/Product';
import type { NextPage } from 'next';
import { ReactElement, useEffect } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { withKindSparePart } from 'services/SEOService';
import { getStringByTemplateStr } from 'services/StringService';

interface Props {
	data: SparePart;
	relatedProducts: SparePart[];
	page: DefaultPage;
	brands: Brand[];
	kindSparePart?: KindSparePart;
	setRenderBeforeFooter: (element: ReactElement | null) => void;
}

const SpareParts: NextPage<Props> = ({ page, brands, kindSparePart, data, relatedProducts, setRenderBeforeFooter }) => {
	useEffect(() => {
		setRenderBeforeFooter(
			<Box marginY='1em' paddingX='1em'>
				<BrandsCarousel linkType='cabins' brands={brands}></BrandsCarousel>
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
					{ text: 'Поколение', value: data.generation?.name },
					...(data.engineNumber ? [{ text: 'Маркировка двигателя', value: data.engineNumber }] : []),
					...(data.engine ? [{ text: 'Двигатель', value: data.engine }] : []),
					{ text: 'Запчасть', value: data.kindSparePart?.name },
					{ text: 'Марка', value: data.brand?.name },
					{ text: 'Модель', value: data.model?.name },
					{ text: 'Год', value: data.year },
					{ text: 'Коробка', value: data.transmission },
					{ text: 'Обьем', value: data.volume?.name },
					{ text: 'Тип топлива', value: data.fuel as any }
				]}
				page={page as PageProduct & PageProductSparePart}
				relatedProducts={relatedProducts}
			></Product>
		);
	}
	return <CatalogSpareParts page={page} brands={brands} kindSparePart={kindSparePart}></CatalogSpareParts>;
};

export default SpareParts;

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
				data: { data: pageSparePart }
			}
		] = await Promise.all([
			fetchSparePart(productParam),
			fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
			fetchPage<PageProductSparePart>('product-spare-part', { populate: ['seo'] })()
		]);
		const {
			data: { data: relatedProducts }
		} = await fetchSpareParts({
			filters: {
				sold: { $eq: false },
				id: {
					$ne: data.id
				},
				model: data.model?.id || ''
			},
			populate: ['images', 'brand']
		});
		const autoSynonyms = pageSparePart?.autoSynonyms.split(',') || [];
		let randomAutoSynonym = autoSynonyms[Math.floor(Math.random() * autoSynonyms.length)];
		props = {
			data,
			page: {
				...page,
				...pageSparePart,
				additionalDescription: getStringByTemplateStr(pageSparePart.additionalDescription, data),
				textAfterDescription: pageSparePart.textAfterDescription.replace('{autoSynonyms}', randomAutoSynonym),
				seo: getProductPageSeo(pageSparePart.seo, data)
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
				populate: ['seoSpareParts.images', 'image'],
				filters: { brand: { slug: brand } }
			}),
			...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
		]);
		const kindSparePart = resultKindSpareParts?.data?.data[0];
		props = {
			page: { seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name) },
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
				populate: ['seoSpareParts.images', 'image']
			}),
			...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
		]);
		const kindSparePart = resultKindSpareParts?.data?.data[0];
		props = {
			page: { seo: withKindSparePart(data.seoSpareParts, 'запчасти', kindSparePart?.name) },
			...(kindSparePart ? { kindSparePart } : {})
		};
	} else {
		const [
			{
				data: { data }
			},
			resultKindSpareParts
		] = await Promise.all([
			fetchPage('spare-part')(),
			...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
		]);
		const kindSparePart = resultKindSpareParts?.data?.data[0];

		props = {
			page: { seo: withKindSparePart(data.seo, 'запчасти', kindSparePart?.name) },
			...(kindSparePart ? { kindSparePart } : {})
		};
	}
	return props;
});
