import { Box } from '@mui/material';
import { ContactInfoForm } from './contactInfoForm.component';
import { DeliveryMethodForm } from './deliveryMethodForm.component';
import { PaymentMethodForm } from './paymentMethodForm.component';
import { reatomComponent } from '@reatom/react';
import { useRef, type ChangeEvent } from 'react';
import { useDI } from '../orderRegistration.di';

export const OrderRegistrationForm = reatomComponent(() => {
	const { orderRegistrationStore } = useDI();
	const formData = orderRegistrationStore.formData();
	const disabled = orderRegistrationStore.isFormLocked();
	// A DOM handle for the hidden file input, not state.
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			orderRegistrationStore.updateField('uploadedFile', file);
		}
	};

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
				onUserTypeChange={(userType) => orderRegistrationStore.updateField('userType', userType)}
				onFieldChange={(field, value) => orderRegistrationStore.updateField(field, value)}
				onUploadClick={() => fileInputRef.current?.click()}
				onFileChange={handleFileChange}
				disabled={disabled}
			/>
            <DeliveryMethodForm
				formData={formData}
				onDeliveryMethodChange={(method) => orderRegistrationStore.changeDeliveryMethod(method)}
				onFieldChange={(field, value) => orderRegistrationStore.updateField(field, value)}
				disabled={disabled}
			/>
            <PaymentMethodForm
				formData={formData}
				onPaymentMethodChange={(method) => orderRegistrationStore.changePaymentMethod(method)}
				disabled={disabled}
			/>
        </Box>
    );
});
