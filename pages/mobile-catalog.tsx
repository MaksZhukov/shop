import { UAParser } from 'ua-parser-js';
import { GetServerSidePropsContext } from 'next';
import { getPageProps } from 'services/PagePropsService';

export default function MobileCatalog() {
	return <div>MobileCatalog</div>;
}

export const getServerSideProps = getPageProps(undefined, async (context, deviceTypeResult) => {
	// if (deviceTypeResult === 'desktop') {
	// 	return {
	// 		redirect: {
	// 			destination: '/',
	// 			permanent: false
	// 		}
	// 	};
	// }

	return Promise.resolve({ props: { layout: { footer: {} }, page: { seo: {} } } });
});
