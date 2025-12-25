import { Box, Typography } from '@mui/material';
import { Link, MobileQuestionsSection } from 'shared/ui';
import { OrderRegistrationForm, OrderSummary, useOrderRegistrationForm } from 'features/orderRegistration';
import { useOrderRegistration } from 'features/orderRegistration/hooks/useOrderRegistration';
import { OrderSuccess } from 'features/orderRegistration/ui/OrderSuccess';
import { useState } from 'react';

export const OrderRegistration = () => {
	const [isOrdered, setIsOrdered] = useState(false);
	const form = useOrderRegistrationForm();
	const { checkoutItems, totalAmount, getButtonText } = useOrderRegistration();

	const handleCheckout = () => {
		const success = form.handleCheckout();
		if (success) {
			setIsOrdered(true);
		}
	};

	if (isOrdered) {
		return <OrderSuccess />;
	}

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
					onCheckout={handleCheckout}
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
