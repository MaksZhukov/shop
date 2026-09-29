import { Box, Button, TextField } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import type { FormEvent } from 'react';
import { useDI } from '../profile.di';
import styles from './profileForm.module.scss';

export const ProfileForm = reatomComponent(() => {
	const { userService, userStore } = useDI();
	const isSaving = !userService.saveUserInfo.ready();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		userService.saveUserInfo();
	};

	return (
		<Box component='form' onSubmit={handleSubmit} className={styles.content} sx={{ marginBottom: '2em' }}>
			<TextField value={userStore.email} placeholder='Почта' disabled variant='standard' margin='normal' fullWidth />
			<TextField
				value={userStore.username}
				onChange={(e) => userStore.setUsername(e.target.value)}
				placeholder='ФИО'
				variant='standard'
				margin='normal'
				fullWidth
			/>
			<TextField
				value={userStore.phone}
				onChange={(e) => userStore.setPhone(e.target.value)}
				placeholder='Телефон'
				variant='standard'
				margin='normal'
				fullWidth
			/>
			<TextField
				value={userStore.address}
				onChange={(e) => userStore.setAddress(e.target.value)}
				placeholder='Адрес'
				variant='standard'
				margin='normal'
				fullWidth
			/>
			<Button fullWidth type='submit' variant='contained' disabled={isSaving}>
				Сохранить
			</Button>
		</Box>
	);
});
