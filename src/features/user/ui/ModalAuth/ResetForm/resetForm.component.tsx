import { Button } from '@mui/material';
import { ChangeEvent } from 'react';
import type { ModalAuthFormProps } from '../types';
import { AuthFormHeader, PasswordInput } from '../shared';
import { useResetForm } from '../hooks';

export const ResetForm = ({ isLoading, onChangeIsLoading, onChangeType }: ModalAuthFormProps) => {
	const { password, setPassword, handleSubmit } = useResetForm({
		onChangeIsLoading,
		onChangeType
	});

	return (
		<>
			<AuthFormHeader title='Введите новый пароль' />
			<form onSubmit={handleSubmit}>
				<PasswordInput
					fullWidth
					disabled={isLoading}
					name='password'
					size='medium'
					sx={{ marginBottom: 1.5 }}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
					value={password}
					required
					placeholder='Пароль'
				/>
				<Button disabled={isLoading} variant='contained' type='submit' fullWidth>
					Сохранить
				</Button>
			</form>
		</>
	);
};

export default ResetForm;
