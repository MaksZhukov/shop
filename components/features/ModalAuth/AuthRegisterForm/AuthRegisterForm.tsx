import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, Input, InputAdornment, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent, useState } from 'react';
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
const AuthRegisterForm = ({ type, isLoading, onChangeType, onChangeIsLoading, onChangeModalOpened }: Props) => {
	const [email, setEmail] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');

	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();

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
					// store.cart.loadShoppingCart(),
					store.favorites.loadFavorites()
				]);
				onChangeModalOpened(false);
				enqueueSnackbar('Вы вошли в свой аккаунт', {
					variant: 'success'
				});
			} catch (err) {
				debugger;
				if (axios.isAxiosError(err)) {
					if (err.response?.data.error?.status === 400 || err.response?.status === 500) {
						enqueueSnackbar('Неверные данные', {
							variant: 'error'
						});
					}
				}
			}
		}
		if (type === 'register') {
			try {
				await register(email, password);
				enqueueSnackbar('Вы успешно зарегистрировались', {
					variant: 'success'
				});
				onChangeType('login');
				setEmail('');
				setPassword('');
			} catch (err) {
				if (axios.isAxiosError(err)) {
					if (err.response?.data.error.status === 400) {
						if (err.response.data.error.message === 'Email is already taken') {
							enqueueSnackbar('Такой пользователь уже существует', {
								variant: 'error'
							});
						}
					}
				}
			}
		}
		onChangeIsLoading(false);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<form onSubmit={handleClickSubmit}>
			<Typography textAlign='center' variant='h5' sx={{ marginBottom: 1 }}>
				{type === 'login' ? 'Авторизация' : 'Регистрация'}
			</Typography>
			<Input
				fullWidth
				disabled={isLoading}
				name='email'
				size='medium'
				sx={{ marginBottom: 1 }}
				onChange={handleChangeEmail}
				value={email}
				required
				placeholder='Почта'
			></Input>
			<Input
				disabled={isLoading}
				fullWidth
				required
				sx={{ marginBottom: '1em' }}
				value={password}
				size='medium'
				onChange={handleChangePassword}
				type={showPassword ? 'text' : 'password'}
				name='password'
				placeholder='Пароль'
				endAdornment={
					<InputAdornment position='end'>
						<IconButton
							aria-label='toggle password visibility'
							onClick={handleClickShowPassword}
							edge='end'
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
			></Input>
			<Button disabled={isLoading} variant='contained' type='submit' fullWidth>
				{type === 'login' ? 'Войти' : 'Зарегистрироваться'}
			</Button>
		</form>
	);
};

export default AuthRegisterForm;
