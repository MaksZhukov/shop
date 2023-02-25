import Button from '@mui/material/Button';
import { SxProps } from '@mui/material';
import { Product } from 'api/types';
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';
import { fetchOrderCheckout } from 'api/orders';
import getConfig from 'next/config';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

interface Props {
    sx?: SxProps;
    product: Product;
}

const Buy: FC<Props> = ({ sx, product }) => {
    const { enqueueSnackbar } = useSnackbar();
    const handleClickBuy = async () => {
        const {
            data: {
                data: { token }
            }
        } = await fetchOrderCheckout(product.id, product.type);

        const params = {
            checkout_url: 'https://checkout.bepaid.by',
            token,
            checkout: {
                iframe: true,
                test: true,
                transaction_type: 'payment',
                order: {
                    amount: (product.discountPrice || product.price) * 100,
                    currency: 'BYN',
                    description: product.h1
                },
                settings: {
                    language: 'ru',
                    customer_fields: {
                        visible: ['first_name', 'phone', 'email']
                    },
                    notification_url: `${publicRuntimeConfig.backendUrl}/api/orders?token=${token}`
                }
            },
            closeWidget: (status: string) => {
                if (status === 'successful') {
                    // axios.post(`${publicRuntimeConfig.backendUrl}/api/orders?token=${token}`);
                    enqueueSnackbar('Вы успешно заказали товар. Вскоре с вами свяжуться', { variant: 'success' });
                } else if (status === 'failed') {
                    enqueueSnackbar('Что-то пошло не так, попробуйте ещё раз', { variant: 'warning' });
                } else if (status === 'error') {
                    enqueueSnackbar('Что-то пошло не так, попробуйте ещё раз', { variant: 'warning' });
                }
            }
        };
        new BeGateway(params).createWidget();
    };
    return (
        <>
            <Button sx={sx} onClick={handleClickBuy} variant="contained">
                Купить
            </Button>
            {/* <Modal open={isModalOpened}></Modal> */}
        </>
    );
};

export default Buy;
