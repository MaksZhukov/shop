import { Alert, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { resetPassword } from '../../../api/user/user';
import { useStore } from '../../../store';
import { ModalAuthStates } from '../types';

interface Props {
	isLoading: boolean;
	onChangeIsLoading: (val: boolean) => void;
	onChangeType: (type: ModalAuthStates) => void;
}

const ResetForm = ({ onChangeType, onChangeIsLoading, isLoading }: Props) => {
	const router = useRouter();
	const store = useStore();
	const { code } = router.query as { code: string };

	const [password, setPassword] = useState<string>('');
	const [passwordConfirmation, setPasswordConfirmation] =
		useState<string>('');

	const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleChangePasswordConfirmation = (
		e: ChangeEvent<HTMLInputElement>
	) => {
		setPasswordConfirmation(e.target.value);
	};
	const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onChangeIsLoading(true);
		try {
			await resetPassword(code, password, passwordConfirmation);
			store.notification.showMessage({
				content: (
					<Alert severity='success' variant='filled'>
						Пароль успешно изменён
					</Alert>
				),
			});
			router.push('/');
			onChangeType('login');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				store.notification.showMessage({
					content: (
						<Alert severity='warning' variant='filled'>
							Неверные данные
						</Alert>
					),
				});
			}
		}
		onChangeIsLoading(false);
	};
	return (
		<form onSubmit={handleClickSubmit}>
			<Typography textAlign='center' variant='h4'>
				Изменение пароля
			</Typography>
			<TextField
				fullWidth
				disabled={isLoading}
				margin='normal'
				name='password'
				type='password'
				onChange={handleChangePassword}
				value={password}
				required
				placeholder='Пароль'></TextField>
			<TextField
				disabled={isLoading}
				fullWidth
				margin='normal'
				name='confirmPassword'
				type='password'
				onChange={handleChangePasswordConfirmation}
				value={passwordConfirmation}
				required
				placeholder='Подтверждение пароля'></TextField>
			<Button
				disabled={passwordConfirmation !== password || isLoading}
				variant='contained'
				type='submit'
				fullWidth>
				Изменить
			</Button>
		</form>
	);
};

export default ResetForm;
