import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useStore } from '../store';
import styles from './profile.module.scss';

const Profile = () => {
    const store = useStore();
    console.log(store.user);
    return (
        <Container>
            <Typography margin="1em 0" textAlign="center" variant="h3" component="h1">
                Профиль
            </Typography>
        </Container>
    );
};

export default Profile;
