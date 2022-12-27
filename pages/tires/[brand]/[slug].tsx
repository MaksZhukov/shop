import { fetchPage } from 'api/pages';
import { PageProduct, PageProductTire } from 'api/pages/types';
import { fetchTire, fetchTires } from 'api/tires/tires';
import { Tire } from 'api/tires/types';
import { Wheel } from 'api/wheels/types';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';

interface Props {
	data: Tire;
	page: PageProduct & PageProductTire;
	relatedProducts: Tire[];
}

const TirePage = ({ data, page, relatedProducts }: Props) => {
	return (
		<Product
			data={data}
			printOptions={[
				{ text: 'Артикул', value: data.id },
				{ text: 'Количество', value: data.count },
				{ text: 'Марка', value: data.brand?.name },
				{ text: 'Диаметр', value: data.diameter?.name },
				{ text: 'Высота', value: data.height?.name },
				{ text: 'Ширина', value: data.width?.name },
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
		{
			data: { data: pageTire },
		},
	] = await Promise.all([
		fetchTire(context.params?.slug || ''),
		fetchPage<PageProduct>('product', { populate: ['linksWithImages.image', 'benefits'] })(),
		fetchPage<PageProductTire>('product-tire', { populate: ['seo'] })(),
	]);
	const {
		data: { data: relatedProducts },
	} = await fetchTires({
		filters: {
			price: { $gt: 0 },
			id: {
				$ne: data.id,
			},
			brand: data.brand?.id,
		},
		populate: ['images', 'brand'],
	});
	return {
		data,
		page: {
			...page,
			...pageTire,
			seo: getProductPageSeo(pageTire.seo, data),
		},
		relatedProducts,
	};
});

export default TirePage;
