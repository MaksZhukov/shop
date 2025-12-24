import { useState, useRef, ChangeEvent } from 'react';
import { useSnackbar } from 'notistack';
import type { OrderRegistrationFormData, UserType, DeliveryMethod, PaymentMethod } from '../types';

export const useOrderRegistrationForm = () => {
	const [formData, setFormData] = useState<OrderRegistrationFormData>({
		userType: 'individual',
		name: '',
		unp: '',
		phone: '',
		email: '',
		deliveryMethod: 'delivery',
		address: '',
		comment: '',
		paymentMethod: 'online',
		uploadedFile: null
	});
	const { enqueueSnackbar } = useSnackbar();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const updateField = <K extends keyof OrderRegistrationFormData>(field: K, value: OrderRegistrationFormData[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleUserTypeChange = (userType: UserType) => {
		updateField('userType', userType);
	};

	const handleDeliveryMethodChange = (deliveryMethod: DeliveryMethod) => {
		setFormData((prev) => {
			const updated = { ...prev, deliveryMethod };
			if (deliveryMethod === 'delivery' && prev.paymentMethod === 'pickup') {
				updated.paymentMethod = 'online';
			}
			return updated;
		});
	};

	const handlePaymentMethodChange = (paymentMethod: PaymentMethod) => {
		if (paymentMethod === 'pickup' && formData.deliveryMethod !== 'pickup') {
			return;
		}
		updateField('paymentMethod', paymentMethod);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			updateField('uploadedFile', file);
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const validateForm = (): boolean => {
		// Validate required fields
		if (!formData.name || !formData.name.trim()) {
			return false;
		}

		if (!formData.phone || !formData.phone.trim()) {
			return false;
		}

		if (!formData.email || !formData.email.trim()) {
			return false;
		}

		// Validate UNP for legal entities
		if (formData.userType === 'legal' && (!formData.unp || !formData.unp.trim())) {
			return false;
		}

		// Validate uploaded file for legal entities
		if (formData.userType === 'legal' && !formData.uploadedFile) {
			return false;
		}

		// Validate address for delivery method
		if (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.address.trim())) {
			return false;
		}

		// Validate payment method
		if (!formData.paymentMethod) {
			return false;
		}

		return true;
	};

	const handleCheckout = () => {
		if (!validateForm()) {
			enqueueSnackbar('Пожалуйста, заполните все обязательные поля', { variant: 'error' });
			return;
		}
		// TODO: Implement checkout logic
		console.log('Checkout:', formData);
	};

	return {
		formData,
		fileInputRef,
		updateField,
		handleUserTypeChange,
		handleDeliveryMethodChange,
		handlePaymentMethodChange,
		handleFileChange,
		handleUploadClick,
		handleCheckout,
		validateForm
	};
};
