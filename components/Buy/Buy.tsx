import { useState } from 'react';
import Button from '@mui/material/Button';
import { Modal, SxProps } from '@mui/material';
import { Product } from 'api/types';
import { FC } from 'react';
import { fetchOrderCheckout } from 'api/orders';
import Loader from 'components/Loader';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSnackbar } from 'notistack';
import Script from 'next/script';

interface Props {
    sx?: SxProps;
    products: Product[];
    onSold?: () => void;
}

const Buy: FC<Props> = ({ sx, products, onSold = () => {} }) => {
    const [token, setToken] = useState<string>('');
    const [isLoadingToken, setIsLoadingToken] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClickBuy = async () => {
        let newToken = token;
        if (!newToken) {
            setIsLoadingToken(true);
            try {
                const {
                    data: { data }
                } = await fetchOrderCheckout(products.map((item) => ({ id: item.id, type: item.type })));
                newToken = data.token;
                setToken(newToken);
            } catch (err) {
                console.log(err);
            }
            setIsLoadingToken(false);
        }
        const params = {
            checkout_url: 'https://checkout.bepaid.by',
            token: newToken,
            closeWidget: async (status: string | null | undefined) => {
                if (status === 'successful') {
                    onSold();
                    enqueueSnackbar('Спасибо за заказ, вам прийдет уведомление на почту', { variant: 'success' });
                }
                // Close after expired
                if (status === undefined) {
                    setIsLoadingToken(true);
                    const {
                        data: { data }
                    } = await fetchOrderCheckout(products.map((item) => ({ id: item.id, type: item.type })));
                    setToken(data.token);
                    setIsLoadingToken(false);
                }
                setToken('');
            }
        };
        new BeGateway(params).createWidget();
    };
    return (
        <>
            <Script src='https://js.bepaid.by/widget/be_gateway.js'></Script>
            <Button disabled={!products.length} sx={sx} onClick={handleClickBuy} variant='contained'>
                Купить в 1 клик
                <ShoppingCartIcon sx={{ color: '#fff', marginLeft: '0.25em' }}></ShoppingCartIcon>
            </Button>
            <Modal open={isLoadingToken}>
                <Loader></Loader>
            </Modal>
        </>
    );
};

export default Buy;
