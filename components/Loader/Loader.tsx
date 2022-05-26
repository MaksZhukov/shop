import { CircularProgress } from '@mui/material';
import styles from './Loader.module.scss';

const Loader = () => {
    return (
        <div className={styles.wrapper}>
            <CircularProgress></CircularProgress>
        </div>
    );
};

export default Loader;
