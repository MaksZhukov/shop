import { PrivacyEntry } from 'features/privacy';
import { getPageProps } from 'shared/utils/pagePropsUtils';

const Privacy = () => <PrivacyEntry />;

export default Privacy;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		page: {
			seo: {
				title: 'Политика конфиденциальности',
				description: 'Наша политика конфиденциальности',
				keywords: 'политика конфиденциальности'
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Политика конфиденциальности', href: '/privacy' }
		]
	}
}));
