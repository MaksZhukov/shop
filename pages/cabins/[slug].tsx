import { fetchCabin, fetchCabins } from 'api/cabins/cabins';
import { Cabin } from 'api/cabins/types';
import { fetchPage } from 'api/pages';
import { PageProduct } from 'api/pages/types';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: Cabin;
	page: PageProduct;
	relatedProducts: Cabin[];
}

const ProductPage = ({ data, page, relatedProducts }: Props) => {
	return (
		<Product
			data={data}
			printOptions={[
				{ text: 'Артикул', value: data.id },
				{ text: 'Марка', value: data.brand?.name },
				{ text: 'Модель', value: data.model?.name },
				{ text: 'Поколение', value: data.generation?.name },
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
	] = await Promise.all([fetchCabin(context.params?.slug || ''), fetchPage<PageProduct>('product')()]);
	const {
		data: { data: relatedProducts },
	} = await fetchCabins({
		filters: {
			id: {
				$ne: data.id,
			},
			model: data.model?.id || '',
		},
		populate: ['images'],
	});
	const autoSynonyms = page?.autoSynonyms.split(',') || [];
	let randomAutoSynonym = autoSynonyms[Math.floor(Math.random() * autoSynonyms.length)];
	return {
		data,
		page: {
			...page,
			textAfterDescription: page?.textAfterDescription.replace('{autoSynonyms}', randomAutoSynonym),
			title: page.title.replace('{h1}', data.h1),
			description: page.description.replace('{h1}', data.h1),
		},
		relatedProducts,
	};
});

export default ProductPage;
