export type UserType = 'individual' | 'legal';
export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'online' | 'cash' | 'bank_transfer' | 'pickup' | 'receive_invoice';

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
