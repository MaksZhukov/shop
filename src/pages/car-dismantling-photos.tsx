import { pageApi, DefaultPage } from 'entities/page';
import { Image as IImage } from 'shared/api/types';
import { Gallery } from 'widgets/gallery';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
interface Props {
	page: DefaultPage & { images: IImage[] };
}

const CarDismantlingPhotos: NextPage<Props> = ({ page }) => <Gallery page={page}></Gallery>;

export default CarDismantlingPhotos;

export const getStaticProps = getPageProps(
	pageApi.fetchPage('car-dismantling-photo', { populate: ['images', 'seo.images'] })
);
