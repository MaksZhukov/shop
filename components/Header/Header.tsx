import { AppBar, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ModalAuth from '../ModalAuth';
import styles from './Header.module.scss';

const Header = () => {
    const router = useRouter();
    const { code } = router.query;

    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
    useEffect(() => {
        if (code) {
            setIsOpenedModal(true);
        }
    }, [code]);
    const handleClick = () => {
        setIsOpenedModal(true);
    };
    return (
        <AppBar>
            <Button variant='contained' onClick={handleClick}>
                Вход
            </Button>
            {isOpenedModal && (
                <ModalAuth
                    isResetPassword={!!code}
                    onChangeModalOpened={setIsOpenedModal}></ModalAuth>
            )}
        </AppBar>
    );
};

export default Header;
