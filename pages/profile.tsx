import { Box, Button, TextField, Typography } from '@mui/material';
import { Container } from '@mui/material';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { useSnackbar } from 'notistack';
import { ChangeEvent, FormEvent } from 'react';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { useSaveUserInfo } from 'features/user/useSaveUserInfo';
import styles from './profile.module.scss';
import { useUserStore } from 'entities/user';

const Profile = observer(() => {
	const userStore = useUserStore();
	const { enqueueSnackbar } = useSnackbar();
	const saveUserInfo = useSaveUserInfo();

	const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
		userStore.setUsername(e.target.value);
	};
	const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
		userStore.setPhone(e.target.value);
	};

	const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
		userStore.setAddress(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await saveUserInfo();
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
						value={userStore.email}
						placeholder='Почта'
						disabled
						variant='standard'
						margin='normal'
						fullWidth
					></TextField>
					<TextField
						value={userStore.username}
						onChange={handleChangeUsername}
						placeholder='ФИО'
						margin='normal'
						variant='standard'
						fullWidth
					></TextField>
					<TextField
						margin='normal'
						placeholder='Телефон'
						variant='standard'
						fullWidth
						value={userStore.phone}
						onChange={handleChangePhone}
					/>
					<TextField
						value={userStore.address}
						onChange={handleChangeAddress}
						placeholder='Адрес'
						margin='normal'
						variant='standard'
						fullWidth
					></TextField>
					<Button fullWidth type='submit' variant='contained'>
						Сохранить
					</Button>
				</Box>
			</Container>
		</>
	);
});

export default Profile;

export const getStaticProps = getPageProps();
