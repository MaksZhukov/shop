import { fetchPage } from 'api/pages';
import { PageProduct } from 'api/pages/types';
import { Wheel } from 'api/wheels/types';
import { fetchWheel, fetchWheels } from 'api/wheels/wheels';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';

interface Props {
	data: Wheel;
	page: PageProduct;
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
				{ text: 'R Диаметр', value: data.diameter },
				{ text: 'J Ширина', value: data.width },
				{ text: 'Количество отверстий', value: data.numberHoles },
				{ text: 'PCD расстояние между отверстиями', value: data.numberHoles },
				{
					text: 'DIA диаметр центрального отверстия',
					value: data.diameterCenterHole,
				},
				{
					text: 'ET вылет',
					value: data.diskOffset,
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
	] = await Promise.all([
		fetchWheel(context.params?.slug || ''),
		fetchPage<PageProduct>('product', { populate: ['defaultWheelSeo', 'linksWithImages.image', 'benefits'] })(),
	]);
	const {
		data: { data: relatedProducts },
	} = await fetchWheels({
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
			seo: getProductPageSeo(page.defaultWheelSeo, data),
		},
		relatedProducts,
	};
});

export default WheelPage;