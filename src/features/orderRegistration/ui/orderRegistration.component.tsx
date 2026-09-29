import { Box, Typography } from '@mui/material';
import { Link, MobileQuestionsSection } from 'shared/ui';
import { reatomComponent } from '@reatom/react';
import { useOrderCheckout } from '../hooks/useOrderCheckout';
import { useOrderRegistrationForm } from '../hooks/useOrderRegistrationForm';
import { getCheckoutButtonText } from '../lib/getCheckoutButtonText';
import { useDI } from '../orderRegistration.di';
import { OrderRegistrationForm } from './orderRegistrationForm.component';
import { OrderSuccess } from './orderSuccess.component';
import { OrderSummary } from './orderSummary.component';

export const OrderRegistration = reatomComponent(() => {
	const { orderRegistrationStore, removeCartMany } = useDI();
	const isOrdered = orderRegistrationStore.isOrdered();
	const checkoutItems = orderRegistrationStore.checkoutItems();
	const form = useOrderRegistrationForm();
	const { orderCheckout, formattedTime, isExpired, handleCheckout, isReissuingCheckoutToken } = useOrderCheckout({
		formData: form.formData,
		checkoutItems,
		onChangeIsOrdered: (value) => orderRegistrationStore.isOrdered.set(value),
		isOrdered,
		removeCartMany
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
        <Box
            sx={{
                pt: 2,
                pb: { xs: 0, md: 2 }
            }}>
            <Typography variant='h6' component='h1' sx={{
                mb: 2
            }}>
				Оформление заказа
			</Typography>
            {orderCheckout?.order && formattedTime && !isExpired && (
				<Typography
                    variant='body2'
                    sx={{
                        color: 'warning.main',
                        mb: 2
                    }}>
					Время на оплату: {formattedTime}
				</Typography>
			)}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 1
                }}>
				<OrderRegistrationForm form={form} disabled={!!orderCheckout?.order} />
				<OrderSummary
					selectedItemsCount={checkoutItems.length}
					totalAmount={orderRegistrationStore.totalAmount()}
					onCheckout={handleCheckoutClick}
					buttonText={getCheckoutButtonText(form.formData.paymentMethod)}
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
					disabled={isReissuingCheckoutToken}
				/>
			</Box>
            <MobileQuestionsSection />
        </Box>
    );
});
