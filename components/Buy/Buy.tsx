import Button from '@mui/material/Button';
import { SxProps } from '@mui/material';
import { Product } from 'api/types';
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';
import { fetchOrderCheckout } from 'api/orders';
import getConfig from 'next/config';

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
            checkout: {
                iframe: true,
                test: true,
                transaction_type: 'payment',
                token,
                // public_key:
                //     'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvh9glzn7wvBQtt7+6WP4PZeVrqTBmspkCCyQwVKoPKfK2LBHt0KMmFOquJNuxLj4nO3tVE0oEE7ZJhPuUkoh0HHqQjkWHneJqp7dA08UeQHQ09Pg/GjTvA1Knzd+hb/Bv9VxCNuOO3Ov00tHJ1HJZypT5L9oPN5zv8XaZnj56gXMmvqc2Lt8Avxil2u2EIOgyp7xlVVk3Q/Q41RHabAD/Ajikl8H7yWadWCOf2sGje6mgr6T4gBP4MawGeknzEUFiP8wBoP79APTvDaYU2wtp+Z+faPctH7LlpSdhIUyFj17/d400Zbvf7nJMklATVsz/7b/+7a4j6oSt3GE1sJzRQIDAQAB',
                order: {
                    amount: product.price * 100,
                    currency: 'BYN',
                    description: product.h1
                },
                settings: {
                    language: 'ru',
                    customer_fields: {
                        visible: ['first_name', 'phone', 'email']
                    },
                    success_url: `${publicRuntimeConfig.backendUrl}/api/orders?token=${token}`
                }
            },
            closeWidget: (status: string) => {
                if (status === 'successful') {
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
