import { Button, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { forgotPassword } from '../../../api/user/user';
import { useStore } from '../../../store';

const ForgotForm = () => {
    const [email, setEmail] = useState<string>('');
    const store = useStore();
    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            store.notification.showMessage({ message: 'Проверьте свою почту' });
        } catch (err) {}
    };
    return (
        <form onSubmit={handleClickSubmit}>
            <Typography textAlign="center" variant="h4">
                Восстановление пароля
            </Typography>
            <TextField
                fullWidth
                margin="normal"
                name="email"
                onChange={handleChangeEmail}
                value={email}
                required
                placeholder="Почта"></TextField>
            <Button variant="contained" type="submit" fullWidth>
                Восстановить
            </Button>
        </form>
    );
};

export default ForgotForm;
