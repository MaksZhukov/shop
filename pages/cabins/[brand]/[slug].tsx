import { fetchCabin, fetchCabins } from 'api/cabins/cabins';
import { Cabin } from 'api/cabins/types';
import { fetchPage } from 'api/pages';
import { PageProduct } from 'api/pages/types';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';

interface Props {
	data: Cabin;
	page: PageProduct;
	relatedProducts: Cabin[];
}

const CabinPage = ({ data, page, relatedProducts }: Props) => {
	return (
		<Product
			data={data}
			printOptions={[
				{ text: 'Артикул', value: data.id },
				{ text: 'Марка', value: data.brand?.name },
				{ text: 'Модель', value: data.model?.name },
				{ text: 'Поколение', value: data.generation?.name },
				{ text: 'Год', value: data.year },
				{ text: 'Запчасть', value: data.kindSparePart?.name },
				...(data.seatUpholstery ? [{ text: 'Обивка сидений', value: data.seatUpholstery }] : []),
			]}
			page={page}
			relatedProducts={relatedProducts}
		></Product>
	);
};

export const getServerSideProps = getPageProps(undefined, async (context) => {
	const [
		{
			data: { data },
		},
		{
			data: { data: page },
		},
	] = await Promise.all([
		fetchCabin(context.params?.slug || ''),
		fetchPage<PageProduct>('product', { populate: ['defaultCabinSeo', 'linksWithImages.image', 'benefits'] })(),
	]);
	const {
		data: { data: relatedProducts },
	} = await fetchCabins({
		filters: {
			price: { $gt: 0 },
			id: {
				$ne: data.id,
			},
			model: data.model?.id || '',
		},
		populate: ['images', 'brand'],
	});
	const autoSynonyms = page?.autoSynonyms.split(',') || [];
	let randomAutoSynonym = autoSynonyms[Math.floor(Math.random() * autoSynonyms.length)];
	return {
		data,
		page: {
			...page,
			textAfterDescription: page?.textAfterDescription.replace('{autoSynonyms}', randomAutoSynonym),
			seo: getProductPageSeo(page.defaultCabinSeo, data),
		},
		relatedProducts,
	};
});

export default CabinPage;
