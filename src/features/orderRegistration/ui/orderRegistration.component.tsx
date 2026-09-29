import { Box, Typography } from '@mui/material';
import { Link, MobileQuestionsSection } from 'shared/ui';
import { reatomComponent } from '@reatom/react';
import { useDI } from '../orderRegistration.di';
import { OrderRegistrationForm } from './orderRegistrationForm.component';
import { OrderSuccess } from './orderSuccess.component';
import { OrderSummary } from './orderSummary.component';

export const OrderRegistration = reatomComponent(() => {
	const { orderRegistrationStore, orderRegistrationService } = useDI();
	const isOrdered = orderRegistrationStore.isOrdered();
	const formattedRemainingTime = orderRegistrationStore.formattedRemainingTime();

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
            {formattedRemainingTime && (
				<Typography
                    variant='body2'
                    sx={{
                        color: 'warning.main',
                        mb: 2
                    }}>
					Время на оплату: {formattedRemainingTime}
				</Typography>
			)}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 1
                }}>
				<OrderRegistrationForm />
				<OrderSummary
					selectedItemsCount={orderRegistrationStore.checkoutItems().length}
					totalAmount={orderRegistrationStore.totalAmount()}
					onCheckout={() => orderRegistrationService.checkout()}
					buttonText={orderRegistrationStore.buttonText()}
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
					disabled={!orderRegistrationService.checkout.ready() || !orderRegistrationService.reissuePaymentToken.ready()}
				/>
			</Box>
            <MobileQuestionsSection />
        </Box>
    );
});
