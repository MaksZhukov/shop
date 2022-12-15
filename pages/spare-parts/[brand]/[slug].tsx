import { fetchPage } from 'api/pages';
import { PageProduct } from 'api/pages/types';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import { SparePart } from 'api/spareParts/types';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: SparePart;
	page: PageProduct;
	relatedProducts: SparePart[];
}

const SparePartPage = ({ data, page, relatedProducts }: Props) => {
	return (
		<Product
			data={data}
			printOptions={[
				{ text: 'Артикул', value: data.id },
				{ text: 'Марка', value: data.brand?.name },
				{ text: 'Модель', value: data.model?.name },
				{ text: 'Поколение', value: data.generation?.name },
				{ text: 'Запчасть', value: data.kindSparePart?.name },
				{ text: 'Коробка', value: data.transmission },
				{ text: 'Обьем', value: data.volume },
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
	] = await Promise.all([fetchSparePart(context.params?.slug || ''), fetchPage<PageProduct>('product')()]);
	const {
		data: { data: relatedProducts },
	} = await fetchSpareParts({
		filters: {
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
			title: page.title.replace('{h1}', data.h1),
			description: page.description.replace('{h1}', data.h1),
		},
		relatedProducts,
	};
});

export default SparePartPage;
