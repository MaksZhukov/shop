import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';
import { userApi } from 'entities/user';
import { useLogin } from 'features/user/useLogin';

type AuthStep = 'email' | 'password';

interface UseAuthRegisterFormProps {
	onChangeIsLoading: (value: boolean) => void;
	onChangeType: (type: 'auth' | 'forgot' | 'reset') => void;
	onChangeModalOpened: (value: boolean) => void;
	onLoginSuccess?: () => Promise<void>;
}

export const useAuthRegisterForm = ({
	onChangeIsLoading,
	onChangeType,
	onChangeModalOpened,
	onLoginSuccess
}: UseAuthRegisterFormProps) => {
	const [step, setStep] = useState<AuthStep>('email');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const login = useLogin();
	const { enqueueSnackbar } = useSnackbar();

	const handleEmailStepSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStep('password');
	};

	const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onChangeIsLoading(true);
		try {
			await userApi.register(email, password);
			enqueueSnackbar('Вы успешно зарегистрировались', { variant: 'success' });
			setEmail('');
			setPassword('');
			setStep('email');
		} catch (err) {
			if (axios.isAxiosError(err) && err.status === 500) {
				try {
					await login(email, password);
					if (onLoginSuccess) {
						await onLoginSuccess();
					}
					onChangeModalOpened(false);
					enqueueSnackbar('Вы успешно вошли в систему', { variant: 'success' });
				} catch (err) {
					enqueueSnackbar('Неверные данные', { variant: 'error' });
				}
			}
		} finally {
			onChangeIsLoading(false);
		}
	};

	return {
		step,
		email,
		setEmail,
		password,
		setPassword,
		handleEmailStepSubmit,
		handlePasswordSubmit
	};
};
