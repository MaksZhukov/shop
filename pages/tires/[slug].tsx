import { fetchPage } from 'api/pages';
import { PageProduct } from 'api/pages/types';
import { fetchTire, fetchTires } from 'api/tires/tires';
import { Tire } from 'api/tires/types';
import { Wheel } from 'api/wheels/types';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: Tire;
	page: PageProduct;
	relatedProducts: Tire[];
}

const ProductPage = ({ data, page, relatedProducts }: Props) => {
	return (
		<Product
			data={data}
			printOptions={[
				{ text: 'Артикул', value: data.id },
				{ text: 'Количество', value: data.count },
				{ text: 'Марка', value: data.brand?.name },
				{ text: 'Диаметр', value: data.diameter },
				{ text: 'Высота', value: data.height },
				{ text: 'Ширина', value: data.width },
				{ text: 'Сезон', value: data.season },
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
	] = await Promise.all([fetchTire(context.params?.slug || ''), fetchPage<PageProduct>('product')()]);
	const {
		data: { data: relatedProducts },
	} = await fetchTires({
		filters: {
			id: {
				$ne: data.id,
			},
			brand: data.brand.id,
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
