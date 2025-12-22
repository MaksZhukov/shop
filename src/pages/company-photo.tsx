import { pageApi, DefaultPage } from 'entities/page';
import type { Image as IImage } from 'shared/api/types';
import { Gallery } from 'widgets/gallery';
import type { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
interface Props {
	page: DefaultPage & { images: IImage[] };
}

const CompanyPhotos: NextPage<Props> = ({ page }) => <Gallery page={page}></Gallery>;

export default CompanyPhotos;

export const getStaticProps = getPageProps(pageApi.fetchPage('company-photo', { populate: ['images', 'seo.images'] }));
