import { Box, Typography } from '@mui/material';
import { Link, MobileQuestionsSection } from 'shared/ui';
import {
	OrderRegistrationForm,
	OrderSummary,
	OrderSuccess,
	useOrderRegistrationForm,
	useOrderRegistration,
	useOrderCheckout
} from 'features/orderRegistration';

export const OrderRegistration = ({
	isOrdered,
	onChangeIsOrdered
}: {
	isOrdered: boolean;
	onChangeIsOrdered: (isOrdered: boolean) => void;
}) => {
	const form = useOrderRegistrationForm();
	const { checkoutItems, totalAmount, getButtonText } = useOrderRegistration();
	const { orderCheckout, formattedTime, isExpired, handleCheckout } = useOrderCheckout({
		formData: form.formData,
		checkoutItems,
		onChangeIsOrdered,
		isOrdered
	});

	const handleCheckoutClick = async () => {
		const success = form.handleCheckout();
		if (!success) {
			return;
		}
		await handleCheckout();
	};

	if (isOrdered) {
		return <OrderSuccess />;
	}

	return (
		<Box pt={2} pb={{ xs: 0, md: 2 }}>
			<Typography variant='h6' component='h1' mb={2}>
				Оформление заказа
			</Typography>
			{orderCheckout?.order && formattedTime && !isExpired && (
				<Typography variant='body2' color='warning.main' mb={2}>
					Время на оплату: {formattedTime}
				</Typography>
			)}
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={1}>
				<OrderRegistrationForm form={form} disabled={!!orderCheckout?.order} />
				<OrderSummary
					selectedItemsCount={checkoutItems.length}
					totalAmount={totalAmount}
					onCheckout={handleCheckoutClick}
					buttonText={getButtonText(form.formData.paymentMethod)}
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
};
