import { Typography, FormControl, Select, MenuItem, Box } from '@mui/material';
import { WhiteBox } from 'shared/ui';
import type { OrderRegistrationFormData } from '../types';
import type { PaymentMethod } from 'entities/order';

const PAYMENT_DESCRIPTIONS: Partial<Record<PaymentMethod, string>> = {
	online: 'Банковской картой, Samsung Pay, Apple Pay, Карты рассрочки (Халва, Халва+, Халва МАХ, Карта покупок, Черепаха, СмартКарта, Магнит, МТБ Автокарта, Моцная картка)',
	cash: 'Оплата происходит в момент получения доставки наличными деньгами',
	receive_invoice: 'Счет на оплату будет выслан на указанную электронную почту'
};

interface PaymentMethodFormProps {
	formData: OrderRegistrationFormData;
	onPaymentMethodChange: (paymentMethod: PaymentMethod) => void;
	disabled?: boolean;
}

export const PaymentMethodForm = ({ formData, onPaymentMethodChange, disabled = false }: PaymentMethodFormProps) => {
	const isPickupPaymentAvailable = formData.deliveryMethod === 'pickup';
	const isLegalEntity = formData.userType === 'legal';

	return (
		<WhiteBox sx={{ p: 2 }}>
            <Typography variant='h6' component='h2' sx={{
                mb: 2
            }}>
				Способ оплаты *
			</Typography>
            <FormControl fullWidth sx={{ mb: 2, maxWidth: '480px' }} required disabled={disabled}>
				<Select
					value={formData.paymentMethod || ''}
					onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
					size='medium'
					displayEmpty
					required
					disabled={disabled}
					MenuProps={{ disablePortal: true, disableScrollLock: true }}
					renderValue={(value) => {
						if (!value) {
							return <em style={{ color: '#999' }}>Выберите способ оплаты</em>;
						}
						const options: Record<PaymentMethod, string> = {
							online: 'Оплата онлайн',
							cash: 'Оплата наличными',
							bank_transfer: 'Безналичная оплата',
							pickup: 'Оплата в пункте самовывоза',
							receive_invoice: 'Получить счет на оплату'
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
								<Typography
                                    variant='body1'
                                    sx={{
                                        mr: 'auto',
                                        color: 'text.secondary'
                                    }}>
									Оплата в пункте самовывоза
								</Typography>
								<Typography
                                    variant='body2'
                                    sx={{
                                        mr: 'auto',
                                        color: 'text.secondary'
                                    }}>
									Доступно только при самовывозе
								</Typography>
							</>
						)}
					</MenuItem>
					{isLegalEntity && <MenuItem value='receive_invoice'>Получить счет на оплату</MenuItem>}
				</Select>
			</FormControl>
            {PAYMENT_DESCRIPTIONS[formData.paymentMethod] && (
				<Box
                    sx={{
                        maxWidth: '480px',
                        bgcolor: 'custom.bg-surface-1',
                        py: 1,
                        px: 1.5,
                        borderRadius: 2
                    }}>
					<Typography variant='body2' sx={{
                        color: 'custom.text-muted'
                    }}>
						{PAYMENT_DESCRIPTIONS[formData.paymentMethod]}
					</Typography>
				</Box>
			)}
        </WhiteBox>
    );
};
