import type { NextPage } from 'next';
import { AppBar, Button, Container, Input } from '@mui/material';
import { useEffect } from 'react';
import { login } from '../api/user/user';
import styles from './index.module.scss';
import { Box } from '@mui/system';

const Home: NextPage = (props) => {
    return (
        <Container>
            <Box padding="3em 1em" className={styles.wrapper}>
                <Box marginRight="1em" component="aside" className={styles.sider}>
                    <Box display="flex">
                        <Input placeholder="Цена от руб" type="number"></Input>
                        <Input placeholder="Цена до руб" type="number"></Input>
                    </Box>
                    <Box marginTop="1em" textAlign="center">
                        <Button fullWidth variant="contained">
                            Найти
                        </Button>
                    </Box>
                </Box>
                <Box className={styles.content}>
                    <Box className={styles['search-wrapper']}>
                        <Input placeholder="Поиск детали ..." fullWidth></Input>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;
