import { Alert, Avatar, Badge, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../../../store';
import styles from './Profile.module.scss';
import { observer } from 'mobx-react';
import classNames from 'classnames';

interface Props {
    onClickSignIn: () => void;
}

const Profile = ({ onClickSignIn }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpened = !!anchorEl;
    const [isInvisibleBadge, setIsInvisibleBadge] = useState<boolean>(true);
    const isMountedAndLoadedData = useRef<boolean>(false);

    const store = useStore();
    const router = useRouter();

    useEffect(() => {
        if (store.isInitialRequestDone) {
            setTimeout(() => {
                isMountedAndLoadedData.current = true;
            }, 0);
        }
    }, [store.isInitialRequestDone]);

    useEffect(() => {
        if (isMountedAndLoadedData.current) {
            setIsInvisibleBadge(false);
        }
    }, [store.cart.items.length, store.favorites.items.length]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setIsInvisibleBadge(true);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickLogout = () => {
        store.user.logout();
        store.notification.showMessage({ content: <Alert variant="filled">Вы успешно вышли из аккаунта</Alert> });
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
                <Badge color="warning" variant="dot" invisible={isInvisibleBadge}>
                    {store.user.email ? <Avatar>{store.user.email.slice(0, 4)}</Avatar> : <Avatar></Avatar>}
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isOpened}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                {store.user.id ? (
                    <MenuItem
                        className={classNames({
                            [styles['account-menu__item_active']]: router.pathname === '/profile'
                        })}
                        onClick={handleClickLink('/profile')}>
                        Профиль
                    </MenuItem>
                ) : (
                    <MenuItem onClick={onClickSignIn}>Войти</MenuItem>
                )}
                <MenuItem
                    className={classNames({
                        [styles['account-menu__item_active']]: router.pathname === '/favorites'
                    })}
                    onClick={handleClickLink('/favorites')}>
                    Избранные{' '}
                    <Typography component="span" color="primary" paddingLeft="5px">
                        ({store.favorites.items.length})
                    </Typography>
                </MenuItem>
                <MenuItem
                    className={classNames({
                        [styles['account-menu__item_active']]: router.pathname === '/shopping-cart'
                    })}
                    onClick={handleClickLink('/shopping-cart')}>
                    Корзина{' '}
                    <Typography component="span" color="primary" paddingLeft="5px">
                        ({store.cart.items.length})
                    </Typography>
                </MenuItem>
                {store.user.id && <Divider />}
                {store.user.id && <MenuItem onClick={handleClickLogout}>Выход</MenuItem>}
            </Menu>
        </>
    );
};

export default observer(Profile);
