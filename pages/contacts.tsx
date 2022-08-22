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
import Loader from 'components/Loader';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react';
import { saveReviewEmail } from 'services/LocalStorageService';
import { useStore } from 'store';
import styles from './contacts.module.scss';

const Contacts = () => {
	return (
		<Container>
			<WhiteBox>
				<Typography
					marginBottom='0.5em'
					component='h1'
					variant='h4'
					textAlign='center'>
					О нас
				</Typography>
				<Typography textAlign='center' variant='h6'>
					Время работы:
				</Typography>
				<Typography
					textAlign='center'
					marginLeft='2em'
					variant='subtitle1'>
					Понедельник - Пятница: 10:00-18:00
				</Typography>
				<Typography
					textAlign='center'
					marginLeft='2em'
					variant='subtitle1'>
					Суббота - Воскресенье: 10:00-14:00
				</Typography>
				<Box textAlign='center'>
					<Image
						alt='Путь'
						width={390}
						height={685}
						src={'/route.png'}></Image>
				</Box>
			</WhiteBox>
		</Container>
	);
};

export default observer(Contacts);
