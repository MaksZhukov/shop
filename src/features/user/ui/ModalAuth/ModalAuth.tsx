import { Modal } from '@mui/material';
import AuthRegisterForm from './AuthRegisterForm';
import ForgotForm from './ForgotForm';
import ResetForm from './ResetForm';
import { useModalAuth } from './hooks';
import { ModalContainer } from 'shared/ui';

interface ModalAuthProps {
	onChangeModalOpened: (value: boolean) => void;
	isResetPassword: boolean;
	onLoginSuccess?: () => Promise<void>;
}

export const ModalAuth = ({ onChangeModalOpened, isResetPassword, onLoginSuccess }: ModalAuthProps) => {
	const { type, handleModalClose, formProps } = useModalAuth({
		onChangeModalOpened,
		isResetPassword
	});

	const formContent = {
		forgot: <ForgotForm {...formProps} />,
		reset: <ResetForm {...formProps} />,
		auth: (
			<AuthRegisterForm
				{...formProps}
				onChangeModalOpened={onChangeModalOpened}
				onLoginSuccess={onLoginSuccess}
			/>
		)
	};

	return (
		<Modal open onClose={handleModalClose}>
			<ModalContainer
				title=''
				sx={{
					maxWidth: '400px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					py: 2,
					transform: 'translate(-50%, -50%)'
				}}
				onClose={handleModalClose}
			>
				{formContent[type]}
			</ModalContainer>
		</Modal>
	);
};
