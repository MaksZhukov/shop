import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { Image as IImage } from 'api/types';
import Gallery from 'components/Gallery';
interface Props {
	page: DefaultPage & { images: IImage[] };
}

const CompanyPhotos: NextPage<Props> = ({ page }) => <Gallery page={page}></Gallery>;

export default CompanyPhotos;

export const getStaticProps = getPageProps(fetchPage('company-photo', { populate: ['images', 'seo.images'] }));
