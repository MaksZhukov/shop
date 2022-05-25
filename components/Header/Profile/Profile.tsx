import { Avatar, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../../../store';
import styles from './Profile.module.scss';

const Profile = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpened = !!anchorEl;

    const store = useStore();
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickLogout = () => {
        store.user.logout();
        router.push('/');
    };

    const handleClickLink = (path: string) => () => {
        router.push(path);
    };
    return (
        <>
            <IconButton
                className={styles['button']}
                aria-controls={isOpened ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpened ? 'true' : undefined}
                onClick={handleClick}>
                <Avatar>{store.user.email.slice(0, 4)}</Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isOpened}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <MenuItem onClick={handleClickLink('/profile')}>Профиль</MenuItem>
                <MenuItem onClick={handleClickLink('/favorites')}>Избранное</MenuItem>
                <Divider />
                <MenuItem onClick={handleClickLogout}>Выход</MenuItem>
            </Menu>
        </>
    );
};

export default Profile;
