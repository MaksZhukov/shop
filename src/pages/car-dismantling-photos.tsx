import { createRequestContainer } from 'app/di/app.container';
import { PageService, DefaultPage } from 'entities/page';
import type { Image as IImage } from 'shared/api/types';
import { Gallery } from 'features/gallery';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage & { images: IImage[] };
}

const CarDismantlingPhotos: NextPage<Props> = ({ page }) => <Gallery page={page}></Gallery>;

export default CarDismantlingPhotos;

export const getStaticProps = getPageProps(undefined, async () => {
	const pageService = createRequestContainer().get(PageService);
	const page = (
		await pageService.fetchPage('car-dismantling-photo', { populate: ['images', 'seo.images'] })()
	).data.data;

	return { props: { page } };
});
