import { Box } from '@mui/material';
import { CartButton } from 'features/cart';
import type { Product } from 'entities/product';

interface Props {
	product: Product;
}

export const MobileCartButton = ({ product }: Props) => {
	return (
		<Box
			position='fixed'
			bottom={65}
			display={{ xs: 'flex', md: 'none' }}
			zIndex={2}
			bgcolor='custom.bg-surface-1'
			left={0}
			right={0}
			px={2}
			borderTop='1px solid custom.divider'
			py={1}
		>
			<CartButton product={product} sx={{ width: '100%' }} />
		</Box>
	);
};
