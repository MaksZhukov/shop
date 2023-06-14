import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { Image as IImage } from 'api/types';
import Gallery from 'components/Gallery';
import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
interface Props {
	page: DefaultPage & { images: IImage[] };
}

const CarDismantlingPhotos: NextPage<Props> = ({ page }) => <Gallery page={page}></Gallery>;

export default CarDismantlingPhotos;

export const getStaticProps = getPageProps(fetchPage('car-dismantling-photo', { populate: ['images', 'seo.images'] }));
