import { DeliveryMethod, PaymentMethod, UserType } from 'entities/order/orderTypes';

export interface OrderRegistrationFormData {
	userType: UserType;
	companyName: string;
	tin: string;
	username: string;
	phone: string;
	email: string;
	deliveryMethod: DeliveryMethod;
	address: string;
	comment: string;
	paymentMethod: PaymentMethod;
	uploadedFile: File | null;
}
