import { Loader } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { reatomComponent } from '@reatom/react';
import { useOrderRegistration } from 'features/orderRegistration';
import { OrderRegistration } from 'features/orderRegistration';
import { useRemoveCartMany } from 'features/cart';
import { MobileContactsModal } from 'features/mobileContacts';
import { WorkTimetable } from 'features/workTimetable';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface Props {}

const OrderRegistrationPage = reatomComponent(() => {
	const { isLoading, checkoutItems, isOrdered, setIsOrdered } = useOrderRegistration();
	const removeCartMany = useRemoveCartMany();
	const router = useRouter();

	if (!isOrdered && checkoutItems.length === 0 && router.isReady) {
		router.push('/cart');
		return null;
	}

	if (isLoading) {
		return <Loader />;
	}

	return (
		<>
			<OrderRegistration
				isOrdered={isOrdered}
				onChangeIsOrdered={setIsOrdered}
				removeCartMany={removeCartMany}
				renderMobileContacts={(isOpened, onClose) => (
					<MobileContactsModal isOpened={isOpened} onClose={onClose} workTimetable={<WorkTimetable />} />
				)}
			/>
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
