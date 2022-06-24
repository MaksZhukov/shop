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
import { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react';
import { saveReviewEmail } from 'services/LocalStorageService';
import { useStore } from 'store';
import styles from './contacts.module.scss';

const Contacts = () => {
	return (
		<Container>
			<WhiteBox>Contacts</WhiteBox>
		</Container>
	);
};

export default observer(Contacts);
