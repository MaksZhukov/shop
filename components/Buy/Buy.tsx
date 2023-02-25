import Button from '@mui/material/Button';
import { SxProps } from '@mui/material';
import { Product } from 'api/types';
import { FC } from 'react';
import { fetchOrderCheckout } from 'api/orders';

interface Props {
    sx?: SxProps;
    product: Product;
}

const Buy: FC<Props> = ({ sx, product }) => {
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
                    }
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
        </>
    );
};

export default Buy;
