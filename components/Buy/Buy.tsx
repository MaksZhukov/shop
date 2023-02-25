import { useState } from 'react';
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
    const [token, setToken] = useState<string>('');
    const handleClickBuy = async () => {
        let newToken = token;
        if (!newToken) {
            const {
                data: { data }
            } = await fetchOrderCheckout(product.id, product.type);
            newToken = data.token;
            setToken(newToken);
        }
        const params = {
            checkout_url: 'https://checkout.bepaid.by',
            token: newToken
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
