import { Loader } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { observer } from 'mobx-react';
import { useOrderRegistration } from 'features/orderRegistration';
import { OrderRegistration } from 'widgets/orderRegistration';
import { useRouter } from 'next/router';
import Script from 'next/script';

interface Props {}

const OrderRegistrationPage: NextPage<Props> = observer(() => {
	const { isLoading, checkoutItems } = useOrderRegistration();
	const router = useRouter();

	if (checkoutItems.length === 0 && router.isReady) {
		router.push('/cart');
		return null;
	}

	if (isLoading) {
		return <Loader />;
	}

	return (
		<>
			<OrderRegistration />
			<Script
				async
				id='bepaid'
				strategy='afterInteractive'
				src='https://js.bepaid.by/widget/be_gateway.js'
			></Script>
		</>
	);
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
