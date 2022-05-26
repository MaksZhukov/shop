import { Label } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    Input,
    TextField,
    Typography,
} from '@mui/material';
import InputMask from 'react-input-mask';
import { Container } from '@mui/system';
import { observer } from 'mobx-react';
import { GetServerSideProps } from 'next';
import { ChangeEvent } from 'react';
import { useStore } from '../store';
import styles from './profile.module.scss';

const Profile = observer(() => {
    const store = useStore();
    const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
        store.user.username = e.target.value;
    };
    const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
        store.user.phone = e.target.value;
    };

    const handleChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
        store.user.address = e.target.value;
    };

    const handleSubmit = () => {
        store.user.saveUserInfo();
    };
    console.log(store.user.phone);
    return (
        <Container>
            <Typography
                margin='1em 0'
                textAlign='center'
                variant='h4'
                component='h1'>
                Профиль
            </Typography>
            <Box
                component='form'
                onSubmit={handleSubmit}
                className={styles.content}>
                <TextField
                    value={store.user.email}
                    label='Email'
                    disabled
                    variant='standard'
                    margin='normal'
                    fullWidth></TextField>
                <TextField
                    value={store.user.username}
                    onChange={handleChangeUsername}
                    label='ФИО'
                    margin='normal'
                    variant='standard'
                    fullWidth></TextField>
                <InputMask
                    mask='+375 99 999 99 99'
                    value={store.user.phone}
                    maskChar=' '
                    onChange={handleChangePhone}>
                    {() => (
                        <TextField
                            label='Телефон'
                            margin='normal'
                            variant='standard'
                            fullWidth></TextField>
                    )}
                </InputMask>
                <TextField
                    value={store.user.address}
                    onChange={handleChangeAddress}
                    label='Адрес'
                    margin='normal'
                    variant='standard'
                    fullWidth></TextField>
                <Button fullWidth type='submit'>
                    Сохранить
                </Button>
            </Box>
        </Container>
    );
});

export default Profile;
