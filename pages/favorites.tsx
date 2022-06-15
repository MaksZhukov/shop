import { Container, Typography, List, ListItem, Divider, Button } from '@mui/material';
import { Box } from '@mui/system';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import ShoppingCartButton from 'components/ShoppingCartButton';
import { observer } from 'mobx-react';
import getConfig from 'next/config';
import Link from 'next/link';
import { Fragment } from 'react';
import { useStore } from 'store';
import styles from './favorites.module.scss';

const { publicRuntimeConfig } = getConfig();

const Favorites = () => {
    const store = useStore();
    let items = store.favorites.items;
    return (
        <Container>
            <Box className={styles.favorites}>
                <Typography variant="h4" component="h1" textAlign="center">
                    Избранные
                </Typography>
                {items.length ? (
                    <List>
                        {items.map((item, index) => {
                            let thumbnailUrl = item.product.images
                                ? publicRuntimeConfig.backendUrl + item.product.images[0].formats.thumbnail.url
                                : null;
                            return (
                                <Fragment key={item.id}>
                                    <ListItem key={item.id}>
                                        {thumbnailUrl ? (
                                            <img
                                                className={styles.img}
                                                src={thumbnailUrl}
                                                alt={item.product.name}></img>
                                        ) : (
                                            <EmptyImageIcon></EmptyImageIcon>
                                        )}
                                        <Box flex="1" padding="1em">
                                            <Typography marginBottom="0.5em" variant="h5" component="h2">
                                                {item.product.name}
                                            </Typography>
                                            <Typography color="text.secondary" className={styles.description}>
                                                {item.product.description}
                                            </Typography>
                                        </Box>
                                        <ShoppingCartButton productId={item.product.id}></ShoppingCartButton>
                                        <FavoriteButton productId={item.product.id}></FavoriteButton>
                                    </ListItem>
                                    {index !== items.length - 1 && <Divider light></Divider>}
                                </Fragment>
                            );
                        })}
                    </List>
                ) : (
                    <Typography variant="subtitle1" marginY="1em" textAlign="center">
                        У вас нет товаров в избранном, добавьте их из
                        <Link href="/">
                            <Button>каталога</Button>
                        </Link>
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default observer(Favorites);
