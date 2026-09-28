import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import type { Product } from 'entities/product';

interface Props {
	product: Product;
	renderCart: (product: Product, sx?: object) => ReactNode;
}

export const MobileCartButton = ({ product, renderCart }: Props) => {
	return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 65,
                display: { xs: 'flex', md: 'none' },
                zIndex: 2,
                bgcolor: 'custom.bg-surface-1',
                left: 0,
                right: 0,
                px: 2,
                borderTop: '1px solid custom.divider',
                py: 1
            }}>
            {renderCart(product, { width: '100%' })}
        </Box>
    );
};
