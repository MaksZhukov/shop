import { fetchPage } from 'api/pages';
import { PageProduct, PageProductWheel } from 'api/pages/types';
import { Wheel } from 'api/wheels/types';
import { fetchWheel, fetchWheels } from 'api/wheels/wheels';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';

interface Props {
	data: Wheel;
	page: PageProduct & PageProductWheel;
	relatedProducts: Wheel[];
}

const WheelPage = ({ data, page, relatedProducts }: Props) => {
	return (
		<Product
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
					value: data.diameterCenterHole?.name,
				},
				{
					text: 'ET вылет',
					value: data.diskOffset?.name,
				},
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
			data: { data: pageWheel },
		},
	] = await Promise.all([
		fetchWheel(context.params?.slug || ''),
		fetchPage<PageProduct>('product', { populate: ['linksWithImages.image', 'benefits'] })(),
		fetchPage<PageProductWheel>('product-wheel', { populate: ['seo'] })(),
	]);
	const {
		data: { data: relatedProducts },
	} = await fetchWheels({
		filters: {
			price: { $gt: 0 },
			id: {
				$ne: data.id,
			},
			model: data.model?.id || '',
		},
		populate: ['images', 'brand'],
	});
	return {
		data,
		page: {
			...page,
			...pageWheel,
			seo: getProductPageSeo(pageWheel.seo, data),
		},
		relatedProducts,
	};
});

export default WheelPage;
