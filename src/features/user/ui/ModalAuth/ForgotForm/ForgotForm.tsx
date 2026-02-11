import { Box, Button, Link, OutlinedInput } from '@mui/material';
import { ChangeEvent } from 'react';
import type { ModalAuthFormProps } from '../types';
import { AuthFormHeader } from '../shared';
import { useForgotForm } from '../hooks';

const submitButtonSx = {
	marginBottom: 1.5,
	bgcolor: 'grey.900',
	'&:hover': { bgcolor: 'grey.800' }
} as const;

export const ForgotForm = ({ isLoading, onChangeIsLoading, onChangeType, email, setEmail }: ModalAuthFormProps) => {
	const { handleSubmit } = useForgotForm({ onChangeIsLoading, email, setEmail });

	return (
		<Box>
			<AuthFormHeader title='Ссылка для сброса пароля будет отправлена на указанную почту' />
			<form onSubmit={handleSubmit}>
				<OutlinedInput
					fullWidth
					disabled={isLoading}
					name='email'
					type='email'
					autoComplete='email'
					size='medium'
					sx={{ marginBottom: 1.5 }}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
					value={email}
					required
					placeholder='Электронная почта'
				/>
				<Button disabled={isLoading} variant='contained' type='submit' fullWidth sx={submitButtonSx}>
					Сбросить пароль
				</Button>
			</form>
			<Box textAlign='center'>
				<Link
					component='button'
					type='button'
					variant='body2'
					color='text.primary'
					onClick={() => onChangeType('auth')}
					sx={{ cursor: 'pointer' }}
				>
					Войти
				</Link>
			</Box>
		</Box>
	);
};

export default ForgotForm;
