import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import type { Cart } from 'entities/cart';
import type { Product } from 'entities/product';
import { CartItem } from './cartItem.component';
import { CartHeader } from './cartHeader.component';

interface CartListProps {
	items: Cart[];
	selectedItems: number[];
	allSelected: boolean;
	onSelectAll: () => void;
	onToggleItem: (itemId: number) => void;
	onDeleteSelected: () => void;
	onRemoveItem: (item: Cart) => void;
	onClickBuy: (item: Cart) => void;
	renderFavorite: (product: Product) => ReactNode;
}

export const CartList = ({
	items,
	selectedItems,
	allSelected,
	onSelectAll,
	onToggleItem,
	onDeleteSelected,
	onRemoveItem,
	onClickBuy,
	renderFavorite
}: CartListProps) => {
	return (
        <Box sx={{
            flex: 1
        }}>
            <CartHeader
				allSelected={allSelected}
				onSelectAll={onSelectAll}
				onDeleteSelected={onDeleteSelected}
				hasSelectedItems={selectedItems.length > 0}
			/>
            <Box>
				{items.map((item) => (
					<CartItem
						key={item.id}
						item={item}
						isSelected={selectedItems.includes(item.id)}
						onToggleSelect={onToggleItem}
						onRemove={onRemoveItem}
						onClickBuy={onClickBuy}
						renderFavorite={renderFavorite}
					/>
				))}
			</Box>
        </Box>
    );
};
