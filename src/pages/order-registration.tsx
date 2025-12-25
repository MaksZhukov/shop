import { Loader } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { observer } from 'mobx-react';
import { useOrderRegistration } from 'features/orderRegistration';
import { OrderRegistration } from 'widgets/orderRegistration';

interface Props {}

const OrderRegistrationPage: NextPage<Props> = observer(() => {
	const { isLoading } = useOrderRegistration();

	if (isLoading) {
		return <Loader />;
	}

	return <OrderRegistration />;
});

export default OrderRegistrationPage;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		page: {
			seo: {
				title: 'Оформление заказа',
				description: 'Оформление заказа',
				keywords: 'Оформление заказа'
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' },
			{ text: 'Оформление заказа', href: '/order-registration' }
		]
	}
}));
