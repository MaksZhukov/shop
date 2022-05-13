import { Box, Button, Modal, TextField, Typography, Link } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react';
import {
    ChangeEvent,
    FormEvent,
    ReactElement,
    ReactNode,
    useState,
} from 'react';
import { ErrorTypes } from '../../api/types';
import { register } from '../../api/user/user';
import { useStore } from '../../store';
import AuthRegisterForm from './AuthRegisterForm';
import ForgotForm from './ForgotForm/ForgotForm';
import styles from './ModalAuth.module.scss';
import ResetForm from './ResetForm';
import { ModalAuthStates } from './types';

interface Props {
    onChangeModalOpened: (value: boolean) => void;
    isResetPassword: boolean;
}

const ModalAuth = observer(
    ({ onChangeModalOpened, isResetPassword }: Props) => {
        const [type, setType] = useState<ModalAuthStates>(
            isResetPassword ? 'reset' : 'login'
        );

        const handleModalClose = () => {
            onChangeModalOpened(false);
        };

        const handleClickToggleType = (newType: ModalAuthStates) => () => {
            setType(newType);
        };
        let renderAuthRegisterForm = (
            <AuthRegisterForm
                type={type}
                onChangeType={setType}></AuthRegisterForm>
        );

        const formElement = {
            ['forgot']: <ForgotForm></ForgotForm>,
            ['reset']: <ResetForm onChangeType={setType}></ResetForm>,
            ['login']: renderAuthRegisterForm,
            ['register']: renderAuthRegisterForm,
        };

        return (
            <Modal open onClose={handleModalClose}>
                <div className={styles.container}>
                    {formElement[type]}
                    {type !== 'reset' && (
                        <>
                            {' '}
                            <Box textAlign='center' marginTop='10px'>
                                <Link
                                    onClick={handleClickToggleType(
                                        type === 'login' ? 'register' : 'login'
                                    )}>
                                    {type === 'login'
                                        ? 'Зарегистрироваться'
                                        : 'Войти'}
                                </Link>
                            </Box>
                            <Box textAlign='center' marginTop='10px'>
                                <Link
                                    onClick={handleClickToggleType(
                                        type === 'forgot'
                                            ? 'register'
                                            : 'forgot'
                                    )}>
                                    {type === 'forgot'
                                        ? 'Зарегистрироваться'
                                        : 'Забыли пароль'}
                                </Link>
                            </Box>
                        </>
                    )}
                </div>
            </Modal>
        );
    }
);

export default ModalAuth;
