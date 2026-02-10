import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';
import { userApi } from 'entities/user';

interface UseResetFormProps {
	onChangeIsLoading: (value: boolean) => void;
	onChangeType: (type: 'auth' | 'forgot' | 'reset') => void;
}

export const useResetForm = ({ onChangeIsLoading, onChangeType }: UseResetFormProps) => {
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const { code } = router.query as { code: string };

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onChangeIsLoading(true);
		try {
			await userApi.resetPassword(code, password, password);
			enqueueSnackbar('Пароль успешно изменён', { variant: 'success' });
			router.push('/', undefined, { shallow: true });
			onChangeType('auth');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				enqueueSnackbar('Неверные данные', { variant: 'error' });
			}
		} finally {
			onChangeIsLoading(false);
		}
	};

	return { password, setPassword, handleSubmit };
};
