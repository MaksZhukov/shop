import { Box, Button, TextField, Typography } from '@mui/material';
import { Container } from '@mui/material';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent } from 'react';
import { getPageProps } from 'services/PagePropsService';
import { useStore } from '../store';
import styles from './profile.module.scss';

const Profile = observer(() => {
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
		store.user.setUsername(e.target.value);
	};
	const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
		store.user.setPhone(e.target.value);
	};

	const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
		store.user.setAddress(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await store.user.saveUserInfo();
			enqueueSnackbar('Данные успешно обновлены', {
				variant: 'success'
			});
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с обновлением данных, обратитесь в поддержку', {
				variant: 'error'
			});
		}
	};

	return (
		<>
			<Head>
				<title>Профиль</title>
				<meta name='description' content='Профиль пользователя'></meta>
			</Head>
			<Container>
				<Typography textAlign='center' variant='h4' component='h1'>
					Профиль
				</Typography>
				<Box component='form' marginBottom='2em' onSubmit={handleSubmit} className={styles.content}>
					<TextField
						value={store.user.email}
						label='Почта'
						disabled
						variant='standard'
						margin='normal'
						fullWidth
					></TextField>
					<TextField
						value={store.user.username}
						onChange={handleChangeUsername}
						label='ФИО'
						margin='normal'
						variant='standard'
						fullWidth
					></TextField>
					<TextField
						label='Телефон'
						margin='normal'
						variant='standard'
						fullWidth
						value={store.user.phone}
						onChange={handleChangePhone}
						InputProps={{
							inputProps: {
								mask: '+375 00 000 00 00',
								unmask: true
							}
						}}
					/>
					<TextField
						value={store.user.address}
						onChange={handleChangeAddress}
						label='Адрес'
						margin='normal'
						variant='standard'
						fullWidth
					></TextField>
					<Button fullWidth type='submit'>
						Сохранить
					</Button>
				</Box>
			</Container>
		</>
	);
});

export default Profile;

export const getStaticProps = getPageProps();
