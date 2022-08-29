import { Alert, Button, TextField, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { ErrorTypes } from '../../../api/types';
import { register } from '../../../api/user/user';
import { useStore } from '../../../store';
import { ModalAuthStates } from '../types';
interface Props {
	type: ModalAuthStates;
	isLoading: boolean;
	onChangeIsLoading: (val: boolean) => void;
	onChangeType: (type: ModalAuthStates) => void;
	onChangeModalOpened: (value: boolean) => void;
}
const AuthRegisterForm = ({
	type,
	isLoading,
	onChangeType,
	onChangeIsLoading,
	onChangeModalOpened,
}: Props) => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const store = useStore();

	const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onChangeIsLoading(true);
		if (type === 'login') {
			try {
				await store.user.login(email, password);
				await Promise.all([
					store.cart.loadShoppingCart(),
					store.favorites.loadFavorites(),
				]);
				onChangeModalOpened(false);
				store.notification.showMessage({
					content: (
						<Alert severity='success' variant='filled'>
							Вы вошли в свой аккаунт
						</Alert>
					),
				});
			} catch (err) {
				if (axios.isAxiosError(err)) {
					if (
						err.response?.data.error.name ===
							ErrorTypes.ValidationError ||
						err.response?.status === 500
					) {
						store.notification.showMessage({
							content: (
								<Alert severity='warning' variant='filled'>
									Неверные данные
								</Alert>
							),
						});
					}
				}
			}
		}
		if (type === 'register') {
			try {
				await register(email, password);
				store.notification.showMessage({
					content: (
						<Alert severity='success' variant='filled'>
							Вы успешно зарегистрировались
						</Alert>
					),
				});
				onChangeType('login');
				setEmail('');
				setPassword('');
			} catch (err) {
				if (axios.isAxiosError(err)) {
					if (err.response?.data.error.status === 400) {
						if (
							err.response.data.error.message ===
							'Email is already taken'
						) {
							store.notification.showMessage({
								content: (
									<Alert severity='warning' variant='filled'>
										Такой пользователь уже существует
									</Alert>
								),
							});
						}
					}
				}
			}
		}
		onChangeIsLoading(false);
	};
	console.log(isLoading);
	return (
		<form onSubmit={handleClickSubmit}>
			<Typography textAlign='center' variant='h4'>
				{type === 'login' ? 'Авторизация' : 'Регистрация'}
			</Typography>
			<TextField
				fullWidth
				disabled={isLoading}
				margin='normal'
				name='email'
				onChange={handleChangeEmail}
				value={email}
				required
				placeholder='Почта'></TextField>
			<TextField
				disabled={isLoading}
				fullWidth
				margin='normal'
				required
				value={password}
				onChange={handleChangePassword}
				type='password'
				name='password'
				placeholder='Пароль'></TextField>
			<Button
				disabled={isLoading}
				variant='contained'
				type='submit'
				fullWidth>
				{type === 'login' ? 'Войти' : 'Зарегистрироваться'}
			</Button>
		</form>
	);
};

export default AuthRegisterForm;
