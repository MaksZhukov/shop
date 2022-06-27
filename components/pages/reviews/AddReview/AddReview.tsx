import {
	Alert,
	Button,
	FormControl,
	Rating,
	TextField,
	Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import { addReview } from 'api/reviews/reviews';
import { ErrorTypes } from 'api/types';
import axios from 'axios';
import Loader from 'components/Loader';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, FormEvent, useState } from 'react';
import { saveReviewEmail } from 'services/LocalStorageService';
import { useStore } from 'store';
import styles from './AddReview.module.scss';

const AddReview = () => {
	const store = useStore();
	const [rating, setRating] = useState<number | undefined>(undefined);
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [validation, setValidation] = useState<{ email: string }>({
		email: '',
	});
	const [description, setDescription] = useState<string>('');

	const handleChangeRating = (_: any, newValue: number) => {
		setRating(newValue);
	};
	const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
		setDescription(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!store.user.id) {
			saveReviewEmail(email);
		}
		try {
			await addReview({
				email: store.user.email || email,
				authorName: store.user.username || name,
				description,
				rating: rating as number,
			});
			store.notification.showMessage({
				content: (
					<Alert variant='filled'>
						Ваш отзыв отправлен на модерацию
					</Alert>
				),
			});
			store.user.setReviewStatus('draft');
			setValidation({ email: '' });
		} catch (err) {
			if (axios.isAxiosError(err)) {
				if (
					err.response?.data?.error.name ===
					ErrorTypes.ValidationError
				) {
					setValidation({ email: 'Укажите верную почту' });
				}
			}
		}
	};

	const renderByStatus = {
		'': (
			<>
				<Typography marginBottom='1em' variant='h5' textAlign='center'>
					Добавить отзыв
				</Typography>
				<form onSubmit={handleSubmit}>
					<FormControl className={styles['rating-wrapper']}>
						<Typography component='legend' color='text.secondary'>
							Рейтинг *
						</Typography>
						<input
							className={styles['rating-input']}
							type='number'
							required
							value={rating}></input>
						<Rating
							onChange={handleChangeRating}
							value={rating}></Rating>
					</FormControl>
					{!store.user.id && (
						<Box>
							<TextField
								required
								onChange={handleChangeName}
								sx={{ marginRight: '1em' }}
								value={name}
								inputProps={{ maxLength: 100 }}
								variant='standard'
								label='Имя'></TextField>
							<TextField
								required
								onChange={handleChangeEmail}
								value={email}
								error={!!validation['email']}
								helperText={validation['email']}
								variant='standard'
								label='Почта'></TextField>
						</Box>
					)}
					<TextField
						onChange={handleChangeDescription}
						label='Отзыв до 500 символов'
						multiline
						value={description}
						inputProps={{ maxLength: 500 }}
						rows={4}
						maxRows={6}
						variant='outlined'
						margin='normal'
						fullWidth></TextField>
					<Button type='submit' variant='contained'>
						Отправить на модерацию
					</Button>
				</form>
			</>
		),
		draft: (
			<Typography color='primary' textAlign='center'>
				Ваш отзыв на модерации
			</Typography>
		),
		published: (
			<Typography color='primary' textAlign='center'>
				Ваш отзыв уже опубликован
			</Typography>
		),
	};

	if (!store.isInitialRequestDone) {
		return <></>;
	}

	return renderByStatus[store.user.reviewStatus];
};

export default observer(AddReview);
