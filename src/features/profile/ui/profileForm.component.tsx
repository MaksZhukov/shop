import { Button, Stack, TextField } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import type { FormEvent } from 'react';
import { useDI } from '../profile.di';

export const ProfileForm = reatomComponent(() => {
	const { userService, userStore } = useDI();
	const isSaving = !userService.saveUserInfo.ready();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		userService.saveUserInfo();
	};

	return (
		<Stack component='form' onSubmit={handleSubmit} spacing={2}>
			<TextField label='Почта' value={userStore.email} disabled fullWidth />
			<TextField
				label='ФИО'
				value={userStore.username}
				onChange={(e) => userStore.setUsername(e.target.value)}
				fullWidth
			/>
			<TextField
				label='Телефон'
				value={userStore.phone}
				onChange={(e) => userStore.setPhone(e.target.value)}
				fullWidth
			/>
			<TextField
				label='Адрес'
				value={userStore.address}
				onChange={(e) => userStore.setAddress(e.target.value)}
				fullWidth
			/>
			<Button fullWidth type='submit' variant='contained' size='large' disabled={isSaving} sx={{ mt: 1 }}>
				Сохранить
			</Button>
		</Stack>
	);
});
