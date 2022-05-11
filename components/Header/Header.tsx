import { AppBar, Button } from '@mui/material';
import { useState } from 'react';
import ModalAuth from '../ModalAuth';
import styles from './Header.module.scss';

const Header = () => {
    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
    const handleClick = () => {
        setIsOpenedModal(true);
    };
    return (
        <AppBar>
            <Button variant="contained" onClick={handleClick}>
                Вход
            </Button>
            {isOpenedModal && <ModalAuth onChangeModalOpened={setIsOpenedModal}></ModalAuth>}
        </AppBar>
    );
};

export default Header;
