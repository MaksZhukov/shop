import { createRequestContainer } from 'app/di/app.container';
import { PageService } from 'entities/page';
import { PAYMENT_PAGE_SLUG, PaymentEntry, PaymentInjector, type PaymentPage } from 'features/payment';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: PaymentPage;
}

const PaymentPageRoute = ({ page }: Props) => (
	<PaymentInjector value={{ page }}>
		<PaymentEntry />
	</PaymentInjector>
);

export default PaymentPageRoute;

export const getStaticProps = getPageProps(undefined, async () => {
	const pageService = createRequestContainer().get(PageService);
	const page = (await pageService.fetchPage(PAYMENT_PAGE_SLUG)()).data.data;

	return {
		props: {
			page,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Оплата', href: '/payment' }
			]
		}
	};
});
