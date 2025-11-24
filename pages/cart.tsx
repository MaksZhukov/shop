import { Typography } from '@mui/material';
import { WhiteBox } from 'components/ui';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {}

const Cart: NextPage<Props> = () => {
	return (
		<>
			<Typography textAlign='center' component='h1' variant='h4' marginBottom='1em'>
				{'Корзина'}
			</Typography>
		</>
	);
};

export default Cart;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' }
		]
	}
}));
