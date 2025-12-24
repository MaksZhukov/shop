import { Box, Typography } from '@mui/material';
import { Link, Loader, MobileQuestionsSection } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { useStore } from 'app/providers/StoreProvider';
import { observer } from 'mobx-react';
import { OrderRegistrationForm, OrderSummary, useOrderRegistrationForm } from 'features/orderRegistration';

interface Props {}

const OrderRegistration: NextPage<Props> = observer(() => {
	const store = useStore();
	const shoppingCartItems = store.cart.items;
	const selectedItemIds = store.cart.selectedItemsForCheckout;
	const isLoading = store.cart.isLoading || !store.isInitialRequestDone;
	const form = useOrderRegistrationForm();

	if (isLoading) {
		return <Loader />;
	}

	const checkoutItems = shoppingCartItems.filter((item) => !item.product.sold && selectedItemIds.includes(item.id));

	const totalAmount = checkoutItems.reduce(
		(acc, item) => acc + (item.product.discountPrice || item.product.price),
		0
	);

	const getButtonText = () => {
		switch (form.formData.paymentMethod) {
			case 'online':
				return 'Оплатить онлайн';
			case 'cash':
				return 'Оформить заказ';
			case 'bank_transfer':
				return 'Оформить заказ';
			case 'pickup':
				return 'Оформить заказ';
			default:
				return 'Перейти к оформлению';
		}
	};

	return (
		<Box pt={2} pb={{ xs: 0, md: 2 }}>
			<Typography variant='h6' component='h1' mb={2}>
				Оформление заказа
			</Typography>
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={1}>
				<OrderRegistrationForm form={form} />
				<OrderSummary
					selectedItemsCount={checkoutItems.length}
					totalAmount={totalAmount}
					onCheckout={form.handleCheckout}
					buttonText={getButtonText()}
					disclaimerText={
						<>
							Нажимая на кнопку, вы соглашаетесь с{' '}
							<Link color={'info.main'} href='/privacy'>
								Условиями обработки персональных данных
							</Link>
							, а так же с{' '}
							<Link color={'info.main'} href='/terms'>
								Условиями продажи
							</Link>
						</>
					}
				/>
			</Box>
			<MobileQuestionsSection />
		</Box>
	);
});

export default OrderRegistration;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' },
			{ text: 'Оформление заказа', href: '/order-registration' }
		]
	}
}));
