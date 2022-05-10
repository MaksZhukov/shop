import {
    AppBar,
    Box,
    Button,
    Container,
    Link,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import {
    ChangeEvent,
    ChangeEventHandler,
    FormEventHandler,
    useState,
} from 'react';
import { useStores } from '../../store';
import ModalAuth from '../ModalAuth';
import styles from './Header.module.scss';

const Header = () => {
    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
    const handleClick = () => {
        setIsOpenedModal(true);
    };
    return (
        <AppBar>
            <Button variant='contained' onClick={handleClick}>
                Вход
            </Button>
            {isOpenedModal && (
                <ModalAuth onChangeModalOpened={setIsOpenedModal}></ModalAuth>
            )}
        </AppBar>
    );
};

export default Header;
