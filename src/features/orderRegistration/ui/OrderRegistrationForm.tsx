import { Box } from '@mui/material';
import { ContactInfoForm } from './ContactInfoForm';
import { DeliveryMethodForm } from './DeliveryMethodForm';
import { PaymentMethodForm } from './PaymentMethodForm';
import { useOrderRegistrationForm } from '../hooks/useOrderRegistrationForm';

interface OrderRegistrationFormProps {
	form: ReturnType<typeof useOrderRegistrationForm>;
}

export const OrderRegistrationForm = ({ form }: OrderRegistrationFormProps) => {
	const {
		formData,
		fileInputRef,
		handleUserTypeChange,
		handleDeliveryMethodChange,
		handlePaymentMethodChange,
		handleFileChange,
		handleUploadClick,
		updateField
	} = form;

	return (
		<Box flex={1} display='flex' flexDirection='column' gap={1}>
			<ContactInfoForm
				formData={formData}
				fileInputRef={fileInputRef}
				onUserTypeChange={handleUserTypeChange}
				onFieldChange={updateField}
				onUploadClick={handleUploadClick}
				onFileChange={handleFileChange}
			/>
			<DeliveryMethodForm
				formData={formData}
				onDeliveryMethodChange={handleDeliveryMethodChange}
				onFieldChange={updateField}
			/>
			<PaymentMethodForm formData={formData} onPaymentMethodChange={handlePaymentMethodChange} />
		</Box>
	);
};
