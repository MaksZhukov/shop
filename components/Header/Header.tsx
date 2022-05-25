import {
    AppBar,
    Button,
    Collapse,
    Container,
    IconButton,
    Menu,
    MenuItem,
    MenuList,
    Toolbar,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import ModalAuth from '../ModalAuth';
import { Box } from '@mui/system';
import styles from './Header.module.scss';

const pages = ['меню 1', 'меню 2', 'меню 3', 'меню 4', 'меню 5', 'меню 6'];

const Header = () => {
    const router = useRouter();
    const { code } = router.query;

    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
    const [isOpenedMenu, setIsOpenedMenu] = useState<boolean>(false);
    useEffect(() => {
        if (code) {
            setIsOpenedModal(true);
        }
    }, [code]);
    const handleClick = () => {
        setIsOpenedModal(true);
    };

    const handleToggleMenu = () => {
        setIsOpenedMenu(!isOpenedMenu);
    };

    const renderLogo = (type: 'mobile' | 'desktop') => (
        <Box
            sx={{
                display:
                    type == 'desktop'
                        ? { xs: 'none', md: 'flex' }
                        : { xs: 'flex', md: 'none' },
            }}
            {...(type === 'mobile' ? { flex: 1 } : {})}>
            <Typography variant='h5' component='a' href='/' color='white'>
                Logo
            </Typography>
        </Box>
    );

    const renderMobileMenu = (
        <Toolbar>
            <Collapse in>
                <MenuList
                    sx={{
                        flex: 1,
                        display: { xs: 'block', md: 'none' },
                    }}>
                    {pages.map((page) => (
                        <MenuItem key={page}>
                            <Typography color='white' textAlign='center'>
                                {page}
                            </Typography>
                        </MenuItem>
                    ))}
                </MenuList>
            </Collapse>
        </Toolbar>
    );

    return (
        <AppBar position='fixed'>
            <Container>
                <Toolbar>
                    {renderLogo('desktop')}
                    <Box
                        color='white'
                        flex='1'
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                        }}
                        className={styles['mobile-menu']}>
                        <IconButton
                            size='large'
                            aria-controls='header-menu'
                            color='inherit'
                            aria-haspopup='true'
                            onClick={handleToggleMenu}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    {renderLogo('mobile')}
                    <Box
                        justifyContent='center'
                        padding='0 10px'
                        display='flex'
                        flex='1'
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                        }}>
                        {pages.map((page) => (
                            <Button className={styles.menu__item} key={page}>
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Button onClick={handleClick}>
                        <Typography color='white'>Вход</Typography>
                    </Button>
                    {isOpenedModal && (
                        <ModalAuth
                            isResetPassword={!!code}
                            onChangeModalOpened={setIsOpenedModal}></ModalAuth>
                    )}
                </Toolbar>
                <Collapse in={isOpenedMenu}>{renderMobileMenu}</Collapse>
            </Container>
        </AppBar>
    );
};

export default Header;
