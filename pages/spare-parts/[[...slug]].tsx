import { fetchBrandBySlug, fetchBrands } from 'api/brands/brands';
import { Brand, BrandWithSparePartsCount } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModelBySlug } from 'api/models/models';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductSparePart } from 'api/pages/types';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import CatalogSpareParts from 'components/CatalogSpareParts';
import Product from 'components/Product';
import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { withKindSparePart } from 'services/SEOService';
import { getStringByTemplateStr } from 'services/StringService';

interface Props {
	data: SparePart;
	relatedProducts: SparePart[];
	page: DefaultPage;
	brands: BrandWithSparePartsCount[];
	kindSparePart?: KindSparePart;
}

const SpareParts: NextPage<Props> = ({ page, brands, kindSparePart, data, relatedProducts }) => {
	if (data && relatedProducts) {
		return (
			<Product
				data={data}
				printOptions={[
					{ text: 'Артикул', value: data.id },
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
	return <CatalogSpareParts pageData={page} brands={brands} kindSparePart={kindSparePart}></CatalogSpareParts>;
};

export default SpareParts;

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const { slug = [], kindSparePart: kindSparePartSlug } = context.query;
	const [brand, modelOrProductParam] = slug;
	const productParam =
		modelOrProductParam && !modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
	const modelParam = modelOrProductParam && modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;

	const {
		data: { data: brands }
	} = await fetchBrands({
		populate: { image: true, spareParts: { count: true } },
		sort: 'name',
		pagination: { limit: API_MAX_LIMIT },
		filters: {
			spareParts: {
				id: {
					$notNull: true
				}
			}
		}
	});
	let props: any = {
		brands: brands
	};

	if (productParam) {
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
				sold: false,
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
			...props,
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
			...props,
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
			...props,
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
			...props,
			page: { seo: withKindSparePart(data.seo, 'запчасти', kindSparePart?.name) },
			...(kindSparePart ? { kindSparePart } : {})
		};
	}
	return props;
});
