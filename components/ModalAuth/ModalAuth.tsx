import { Box, Button, Modal, TextField, Typography, Link } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react';
import { ErrorTypes } from '../../api/types';
import { register } from '../../api/user/user';
import { useStores } from '../../store';
import styles from './ModalAuth.module.scss';

interface Props {
    onChangeModalOpened: (value: boolean) => void;
}

const ModalAuth = ({ onChangeModalOpened }: Props) => {
    const [email, setEmail] = useState<string>('');
    const [type, setType] = useState<'login' | 'register'>('login');
    const [password, setPassword] = useState<string>('');
    const { user } = useStores();

    const handleModalClose = () => {
        onChangeModalOpened(false);
    };
    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (type === 'login') {
            try {
                await user.login(email, password);
                onChangeModalOpened(false);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.data?.error.name === ErrorTypes.ValidationError) {
                    }
                }
            }
        }
        if (type === 'register') {
            try {
                await register(email, password);
                setType('login');
                setEmail('');
                setPassword('');
            } catch (err) {
                if (axios.isAxiosError(err)) {
                }
            }
        }
    };

    const handleClickToggleType = () => {
        setType(type === 'login' ? 'register' : 'login');
        setEmail('');
        setPassword('');
    };
    return (
        <Modal open onClose={handleModalClose}>
            <form onSubmit={handleClickSubmit} className={styles.form}>
                <Typography textAlign="center" variant="h4">
                    {type === 'login' ? 'Авторизация' : 'Регистрация'}
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    onChange={handleChangeEmail}
                    value={email}
                    required
                    placeholder="Почта"></TextField>
                <TextField
                    fullWidth
                    margin="normal"
                    required
                    value={password}
                    onChange={handleChangePassword}
                    type="password"
                    name="password"
                    placeholder="Пароль"></TextField>
                <Button variant="contained" type="submit" fullWidth>
                    {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </Button>
                <Box textAlign="center" marginTop="10px">
                    <Link onClick={handleClickToggleType}>{type === 'login' ? 'Зарегистрироваться' : 'Войти'}</Link>
                </Box>
            </form>
        </Modal>
    );
};

export default ModalAuth;
