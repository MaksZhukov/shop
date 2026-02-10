import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';
import { userApi } from 'entities/user';

interface UseForgotFormProps {
	onChangeIsLoading: (value: boolean) => void;
}

export const useForgotForm = ({ onChangeIsLoading }: UseForgotFormProps) => {
	const [email, setEmail] = useState('');
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onChangeIsLoading(true);
		try {
			await userApi.forgotPassword(email);
			enqueueSnackbar('Проверьте свою почту', { variant: 'success' });
		} catch (err) {
			if (axios.isAxiosError(err)) {
				enqueueSnackbar('Неверные данные', { variant: 'error' });
			}
		} finally {
			onChangeIsLoading(false);
		}
	};

	return { email, setEmail, handleSubmit };
};
