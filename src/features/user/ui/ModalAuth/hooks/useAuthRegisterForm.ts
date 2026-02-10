import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';
import { userApi } from 'entities/user';
import { useLogin } from 'features/user/useLogin';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

type AuthStep = 'email' | 'password';

interface UseAuthRegisterFormProps {
	onChangeIsLoading: (value: boolean) => void;
	onChangeModalOpened: (value: boolean) => void;
	onLoginSuccess?: () => Promise<void>;
}

export const useAuthRegisterForm = ({
	onChangeIsLoading,
	onChangeModalOpened,
	onLoginSuccess
}: UseAuthRegisterFormProps) => {
	const [step, setStep] = useState<AuthStep>('email');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginAttempts, setLoginAttempts] = useState(0);
	const login = useLogin();
	const { enqueueSnackbar } = useSnackbar();
	const { executeRecaptcha } = useGoogleReCaptcha();

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
				let recaptchaToken: string | undefined =
					loginAttempts < 3 ? undefined : await executeRecaptcha?.('submit_form');
				try {
					await login(email, password, recaptchaToken);
					if (onLoginSuccess) {
						await onLoginSuccess();
					}
					onChangeModalOpened(false);
					enqueueSnackbar('Вы успешно вошли в систему', { variant: 'success' });
					setLoginAttempts(0);
				} catch (err) {
					enqueueSnackbar('Неверные данные', { variant: 'error' });
				}
				setLoginAttempts(loginAttempts + 1);
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
