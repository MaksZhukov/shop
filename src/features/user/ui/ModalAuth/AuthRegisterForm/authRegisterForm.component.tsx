import { Box, Button, Link, OutlinedInput, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import type { ModalAuthFormProps } from '../types';
import { AuthFormHeader, PasswordInput } from '../shared';
import { GoogleIcon } from 'shared/icons';
import { backendUrl } from 'shared/services/EnvService';
import { useAuthRegisterForm } from '../hooks';

interface AuthRegisterFormProps extends ModalAuthFormProps {
	onChangeModalOpened: (value: boolean) => void;
	onLoginSuccess?: () => Promise<void>;
}

export const AuthRegisterForm = ({
	isLoading,
	onChangeType,
	onChangeIsLoading,
	onChangeModalOpened,
	onLoginSuccess,
	email,
	setEmail
}: AuthRegisterFormProps) => {
	const { step, password, setPassword, handleEmailStepSubmit, handlePasswordSubmit } = useAuthRegisterForm({
		onChangeIsLoading,
		email,
		setEmail,
		onChangeModalOpened,
		onLoginSuccess
	});

	if (step === 'password') {
		return (
            <>
                <AuthFormHeader title='Введите пароль' />
                <form onSubmit={handlePasswordSubmit}>
					<PasswordInput
						fullWidth
						disabled={isLoading}
						name='password'
						size='medium'
						sx={{ marginBottom: 1.5 }}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
						value={password}
						required
						placeholder='Введите пароль'
					/>
					<Button disabled={isLoading} variant='contained' type='submit' fullWidth>
						Продолжить
					</Button>
					<Box
                        sx={{
                            textAlign: 'center',
                            mt: 1.5
                        }}>
						<Link
                            component='button'
                            type='button'
                            variant='body2'
                            onClick={() => onChangeType('forgot')}
                            sx={{
                                color: 'text.secondary',
                                cursor: 'pointer'
                            }}>
							Забыли пароль?
						</Link>
					</Box>
				</form>
            </>
        );
	}

	return (
        <Box>
            <AuthFormHeader title='Войдите или создайте профиль' />
            <Button fullWidth variant='outlined' href={`${backendUrl}/api/connect/google`} startIcon={<GoogleIcon />}>
				Продолжить с Google
			</Button>
            <Typography
                variant='body2'
                sx={{
                    color: 'custom.text-muted',
                    textAlign: 'center',
                    my: 1.5
                }}>
				или
			</Typography>
            <form onSubmit={handleEmailStepSubmit}>
				<OutlinedInput
					fullWidth
					disabled={isLoading}
					name='email'
					size='medium'
					type='email'
					autoComplete='email'
					sx={{ marginBottom: 1.5 }}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
					value={email}
					required
					placeholder='Электронная почта'
				/>
				<Button fullWidth variant='contained' type='submit' disabled={isLoading}>
					Продолжить
				</Button>
			</form>
            <Typography
                variant='body2'
                sx={{
                    mt: 0.5,
                    color: 'text.secondary',
                    textAlign: 'center'
                }}>
				Нажимая на кнопку, вы соглашаетесь с{' '}
				<Link href='/privacy' sx={{
                    color: 'info.main'
                }}>
					Условиями обработки персональных данных
				</Link>
			</Typography>
        </Box>
    );
};

export default AuthRegisterForm;
