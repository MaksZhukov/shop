import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Modal, SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import { fetchOrderCheckout } from 'api/orders';
import { Product } from 'api/types';
import Loader from 'components/ui/Loader';
import Script from 'next/script';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';

interface Props {
	sx?: SxProps;
	products: Product[];
	title?: string;
	paymentMethodType?: string;
	onSold?: () => void;
}

const Buy: FC<Props> = ({
	sx,
	products,
	paymentMethodType = 'credit_card',
	title = 'Купить в 1 клик',
	onSold = () => {}
}) => {
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
				} = await fetchOrderCheckout(
					products.map((item) => ({ id: item.id, type: item.type })),
					paymentMethodType
				);
				newToken = data.token;
				setToken(newToken);
				const params = {
					checkout_url: 'https://checkout.bepaid.by',
					token: newToken,
					closeWidget: async (status: string | null | undefined) => {
						if (status === 'successful') {
							onSold();
							enqueueSnackbar('Спасибо за заказ, вам прийдет уведомление на почту', {
								variant: 'success'
							});
						}
						// Close after expired
						if (status === undefined) {
							setIsLoadingToken(true);
							const {
								data: { data }
							} = await fetchOrderCheckout(
								products.map((item) => ({ id: item.id, type: item.type })),
								paymentMethodType
							);
							setToken(data.token);
							setIsLoadingToken(false);
						}
						setToken('');
					}
				};
				new BeGateway(params).createWidget();
			} catch (err) {
				console.log(err);
			}
			setIsLoadingToken(false);
		}
	};
	return (
		<>
			<Script
				async
				id='bepaid'
				strategy='afterInteractive'
				src='https://js.bepaid.by/widget/be_gateway.js'
			></Script>
			<Button disabled={!products.length} sx={sx} onClick={handleClickBuy} variant='contained'>
				{title}
				<ShoppingCartIcon sx={{ color: '#fff', marginLeft: '0.25em' }}></ShoppingCartIcon>
			</Button>
			<Modal open={isLoadingToken}>
				<Loader></Loader>
			</Modal>
		</>
	);
};

export default Buy;
