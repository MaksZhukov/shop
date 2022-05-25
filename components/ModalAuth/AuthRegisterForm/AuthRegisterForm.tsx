import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { ErrorTypes } from '../../../api/types';
import { register } from '../../../api/user/user';
import { useStore } from '../../../store';
import { ModalAuthStates } from '../types';
interface Props {
    type: ModalAuthStates;
    onChangeType: (type: ModalAuthStates) => void;
    onChangeModalOpened: (value: boolean) => void;
}
const AuthRegisterForm = ({ type, onChangeType, onChangeModalOpened }: Props) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const store = useStore();

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
                await store.user.login(email, password);
                await Promise.all([store.cart.getShoppingCart(), store.favorites.getFavorites()]);
                onChangeModalOpened(false);
                store.notification.showMessage({ message: 'Вы вошли в свой аккаунт' });
                setTimeout(() => {
                    store.notification.closeMessage();
                }, 2000);
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
                store.notification.showMessage({ message: 'Вы успешно зарегистрировались' });
                setTimeout(() => {
                    store.notification.closeMessage();
                }, 2000);
                onChangeType('login');
                setEmail('');
                setPassword('');
            } catch (err) {
                if (axios.isAxiosError(err)) {
                }
            }
        }
    };
    return (
        <form onSubmit={handleClickSubmit}>
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
        </form>
    );
};

export default AuthRegisterForm;
