import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent, useState } from 'react';
import { resetPassword } from '../../../api/user/user';
import { ModalAuthStates } from '../types';

interface Props {
	isLoading: boolean;
	onChangeIsLoading: (val: boolean) => void;
	onChangeType: (type: ModalAuthStates) => void;
}

const ResetForm = ({ onChangeType, onChangeIsLoading, isLoading }: Props) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const { code } = router.query as { code: string };

	const [password, setPassword] = useState<string>('');
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

	const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleChangePasswordConfirmation = (e: ChangeEvent<HTMLInputElement>) => {
		setPasswordConfirmation(e.target.value);
	};
	const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onChangeIsLoading(true);
		try {
			await resetPassword(code, password, passwordConfirmation);
			enqueueSnackbar('Пароль успешно изменён', { variant: 'success' });
			router.push('/', undefined, { shallow: true });
			onChangeType('login');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				enqueueSnackbar('Неверные данные', { variant: 'error' });
			}
		}
		onChangeIsLoading(false);
	};
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};
	return (
		<form onSubmit={handleClickSubmit}>
			<Typography textAlign='center' variant='h4'>
				Изменение пароля
			</Typography>
			<OutlinedInput
				fullWidth
				disabled={isLoading}
				name='password'
				sx={{ marginBottom: '0.5em' }}
				type={showPassword ? 'text' : 'password'}
				onChange={handleChangePassword}
				value={password}
				required
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
			></OutlinedInput>
			<OutlinedInput
				disabled={isLoading}
				fullWidth
				sx={{ marginBottom: '1em' }}
				name='confirmPassword'
				type={showConfirmPassword ? 'text' : 'password'}
				onChange={handleChangePasswordConfirmation}
				value={passwordConfirmation}
				required
				placeholder='Подтверждение пароля'
				endAdornment={
					<InputAdornment position='end'>
						<IconButton
							aria-label='toggle password visibility'
							onClick={handleClickShowConfirmPassword}
							edge='end'
						>
							{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
			></OutlinedInput>
			<Button
				disabled={passwordConfirmation !== password || isLoading}
				variant='contained'
				type='submit'
				fullWidth
			>
				Изменить
			</Button>
		</form>
	);
};

export default ResetForm;
