import { Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { resetPassword } from '../../../api/user/user';
import { ModalAuthStates } from '../types';

interface Props {
    onChangeType: ModalAuthStates;
}

const ResetForm = ({ onChangeType }: Props) => {
    const router = useRouter();
    const { code }: { code: string } = router.query;

    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] =
        useState<string>('');

    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleChangePasswordConfirmation = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordConfirmation(e.target.value);
    };
    const handleClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await resetPassword(code, password, passwordConfirmation);
            router.push('/');
            onChangeType('login');
        } catch (err) {}
    };
    return (
        <form onSubmit={handleClickSubmit}>
            <Typography textAlign='center' variant='h4'>
                Изменение пароля
            </Typography>
            <TextField
                fullWidth
                margin='normal'
                name='password'
                type='password'
                onChange={handleChangePassword}
                value={password}
                required
                placeholder='Пароль'></TextField>
            <TextField
                fullWidth
                margin='normal'
                name='confirmPassword'
                type='password'
                onChange={handleChangePasswordConfirmation}
                value={passwordConfirmation}
                required
                placeholder='Подтверждение пароля'></TextField>
            <Button
                disabled={passwordConfirmation !== password}
                variant='contained'
                type='submit'
                fullWidth>
                Изменить
            </Button>
        </form>
    );
};

export default ResetForm;
