import { useState } from 'react';
import Button from '@mui/material/Button';
import { Modal, SxProps } from '@mui/material';
import { Product } from 'api/types';
import { FC } from 'react';
import { fetchOrderCheckout } from 'api/orders';
import Loader from 'components/Loader';

interface Props {
    sx?: SxProps;
    product: Product;
}

const Buy: FC<Props> = ({ sx, product }) => {
    const [token, setToken] = useState<string>('');
    const [isLoadingToken, setIsLoadingToken] = useState<boolean>(false);
    const handleClickBuy = async () => {
        let newToken = token;
        if (!newToken) {
            setIsLoadingToken(true);
            const {
                data: { data }
            } = await fetchOrderCheckout(product.id, product.type);
            newToken = data.token;
            setToken(newToken);
            setIsLoadingToken(false);
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
            <Modal open={isLoadingToken}>
                <Loader></Loader>
            </Modal>
        </>
    );
};

export default Buy;
