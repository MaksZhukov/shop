import { Typography, FormControl, Select, MenuItem, Box } from '@mui/material';
import { WhiteBox } from 'shared/ui';
import type { OrderRegistrationFormData, PaymentMethod } from '../types';

interface PaymentMethodFormProps {
	formData: OrderRegistrationFormData;
	onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
}

export const PaymentMethodForm = ({ formData, onPaymentMethodChange }: PaymentMethodFormProps) => {
	const isPickupPaymentAvailable = formData.deliveryMethod === 'pickup';

	return (
		<WhiteBox p={2}>
			<Typography variant='h6' component='h2' mb={2}>
				Способ оплаты *
			</Typography>
			<FormControl fullWidth sx={{ mb: 2, maxWidth: '480px' }} required>
				<Select
					value={formData.paymentMethod || ''}
					onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
					size='medium'
					displayEmpty
					required
					MenuProps={{ disablePortal: true, disableScrollLock: true }}
					renderValue={(value) => {
						if (!value) {
							return <em style={{ color: '#999' }}>Выберите способ оплаты</em>;
						}
						const options: Record<PaymentMethod, string> = {
							online: 'Оплата онлайн',
							cash: 'Оплата наличными',
							bank_transfer: 'Безналичная оплата',
							pickup: 'Оплата в пункте самовывоза'
						};
						return options[value as PaymentMethod] || value;
					}}
				>
					<MenuItem value='online'>Оплата онлайн</MenuItem>
					<MenuItem value='cash'>Оплата наличными</MenuItem>
					<MenuItem value='bank_transfer'>Безналичная оплата</MenuItem>
					<MenuItem
						value='pickup'
						sx={isPickupPaymentAvailable ? {} : { display: 'flex', flexDirection: 'column' }}
						disabled={!isPickupPaymentAvailable}
					>
						{isPickupPaymentAvailable ? (
							'Оплата в пункте самовывоза'
						) : (
							<>
								<Typography mr={'auto'} variant='body1' color='text.secondary'>
									Оплата в пункте самовывоза
								</Typography>
								<Typography mr={'auto'} variant='body2' color='text.secondary'>
									Доступно только при самовывозе
								</Typography>
							</>
						)}
					</MenuItem>
				</Select>
			</FormControl>
			{formData.paymentMethod === 'online' && (
				<Box maxWidth='480px' bgcolor='custom.bg-surface-1' py={1} px={1.5} borderRadius={2}>
					<Typography variant='body2' color='custom.text-muted'>
						Банковской картой, Samsung Pay, Apple Pay, Карты рассрочки (Халва, Халва+, Халва МАХ, Карта
						покупок, Черепаха, СмартКарта, Магнит, МТБ Автокарта, Моцная картка)
					</Typography>
				</Box>
			)}
		</WhiteBox>
	);
};
