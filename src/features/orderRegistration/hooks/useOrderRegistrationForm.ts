import { useState, useRef, ChangeEvent } from 'react';
import { useSnackbar } from 'notistack';
import type { OrderRegistrationFormData } from '../types';
import type { UserType, DeliveryMethod, PaymentMethod } from 'entities/order';
import { useUserStore } from 'entities/user';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const useOrderRegistrationForm = () => {
	const userStore = useUserStore();
	const [formData, setFormData] = useState<OrderRegistrationFormData>({
		userType: 'individual',
		username: '',
		companyName: '',
		tin: '',
		phone: userStore.phone,
		email: userStore.email,
		deliveryMethod: 'delivery',
		address: userStore.address,
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
		if (formData.userType === 'individual' && (!formData.username || !formData.username.trim())) {
			return false;
		}

		if (!formData.phone || !formData.phone.trim()) {
			return false;
		}

		if (!formData.email || !formData.email.trim()) {
			return false;
		}

		if (!isValidEmail(formData.email)) {
			return false;
		}

		if (formData.userType === 'legal' && (!formData.companyName || !formData.companyName.trim())) {
			return false;
		}

		if (formData.userType === 'legal' && !formData.uploadedFile) {
			return false;
		}

		if (formData.deliveryMethod === 'delivery' && (!formData.address || !formData.address.trim())) {
			return false;
		}

		if (!formData.paymentMethod) {
			return false;
		}

		return true;
	};

	const handleCheckout = (): boolean => {
		if (!validateForm()) {
			const emailInvalid = formData.email?.trim() && !isValidEmail(formData.email);
			enqueueSnackbar(
				emailInvalid
					? 'Введите корректный адрес электронной почты'
					: 'Пожалуйста, заполните все обязательные поля',
				{ variant: 'error' }
			);
			return false;
		}

		return true;
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
