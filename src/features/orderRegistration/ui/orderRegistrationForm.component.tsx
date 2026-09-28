import { Box } from '@mui/material';
import { ContactInfoForm } from './contactInfoForm.component';
import { DeliveryMethodForm } from './deliveryMethodForm.component';
import { PaymentMethodForm } from './paymentMethodForm.component';
import { useOrderRegistrationForm } from '../hooks/useOrderRegistrationForm';

interface OrderRegistrationFormProps {
	form: ReturnType<typeof useOrderRegistrationForm>;
	disabled?: boolean;
}

export const OrderRegistrationForm = ({ form, disabled = false }: OrderRegistrationFormProps) => {
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
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
            <ContactInfoForm
				formData={formData}
				fileInputRef={fileInputRef}
				onUserTypeChange={handleUserTypeChange}
				onFieldChange={updateField}
				onUploadClick={handleUploadClick}
				onFileChange={handleFileChange}
				disabled={disabled}
			/>
            <DeliveryMethodForm
				formData={formData}
				onDeliveryMethodChange={handleDeliveryMethodChange}
				onFieldChange={updateField}
				disabled={disabled}
			/>
            <PaymentMethodForm
				formData={formData}
				onPaymentMethodChange={handlePaymentMethodChange}
				disabled={disabled}
			/>
        </Box>
    );
};
