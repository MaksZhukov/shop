import { CircularProgress } from '@mui/material';
import styles from './Loader.module.scss';
import { FC } from 'react';

export const Loader: FC = () => {
	return (
		<div className={styles.wrapper}>
			<CircularProgress></CircularProgress>
		</div>
	);
};
