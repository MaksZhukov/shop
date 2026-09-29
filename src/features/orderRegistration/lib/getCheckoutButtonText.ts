import type { OrderRegistrationFormData } from '../types';

export const getCheckoutButtonText = (paymentMethod: OrderRegistrationFormData['paymentMethod']) => {
	switch (paymentMethod) {
		case 'online':
			return 'Оплатить онлайн';
		case 'cash':
		case 'bank_transfer':
		case 'pickup':
			return 'Оформить заказ';
		default:
			return 'Перейти к оформлению';
	}
};
