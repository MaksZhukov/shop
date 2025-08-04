import { Box, Modal, Link } from '@mui/material';
import { useState } from 'react';
import AuthRegisterForm from './AuthRegisterForm';
import ForgotForm from './ForgotForm/ForgotForm';
import ResetForm from './ResetForm';
import { ModalAuthStates } from './types';
import { ModalContainer } from 'components/ui';

interface Props {
	onChangeModalOpened: (value: boolean) => void;
	isResetPassword: boolean;
}

const ModalAuth = ({ onChangeModalOpened, isResetPassword }: Props) => {
	const [type, setType] = useState<ModalAuthStates>(isResetPassword ? 'reset' : 'login');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleModalClose = () => {
		if (!isLoading) {
			onChangeModalOpened(false);
		}
	};

	const handleClickToggleType = (newType: ModalAuthStates) => () => {
		setType(newType);
	};
	let renderAuthRegisterForm = (
		<AuthRegisterForm
			isLoading={isLoading}
			onChangeIsLoading={setIsLoading}
			type={type}
			onChangeModalOpened={onChangeModalOpened}
			onChangeType={setType}
		></AuthRegisterForm>
	);

	const formElement = {
		['forgot']: <ForgotForm isLoading={isLoading} onChangeIsLoading={setIsLoading}></ForgotForm>,
		['reset']: (
			<ResetForm isLoading={isLoading} onChangeIsLoading={setIsLoading} onChangeType={setType}></ResetForm>
		),
		['login']: renderAuthRegisterForm,
		['register']: renderAuthRegisterForm
	};
	const title = {
		['forgot']: 'Восстановление пароля',
		['reset']: 'Сброс пароля',
		['login']: 'Авторизация',
		['register']: 'Регистрация'
	};

	return (
		<Modal open onClose={handleModalClose}>
			<ModalContainer
				sx={{
					maxWidth: '400px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)'
				}}
				onClose={handleModalClose}
				title={title[type]}
			>
				{formElement[type]}
				{type !== 'reset' && (
					<>
						<Box textAlign='center' marginTop='10px'>
							<Link onClick={handleClickToggleType(type === 'login' ? 'register' : 'login')}>
								{type === 'login' ? 'Зарегистрироваться' : 'Войти'}
							</Link>
						</Box>
						<Box textAlign='center' marginTop='10px'>
							<Link onClick={handleClickToggleType(type === 'forgot' ? 'register' : 'forgot')}>
								{type === 'forgot' ? 'Зарегистрироваться' : 'Забыли пароль'}
							</Link>
						</Box>
					</>
				)}
			</ModalContainer>
		</Modal>
	);
};

export default ModalAuth;
