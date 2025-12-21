import { Box } from '@mui/material';
import type { Cart } from 'entities/cart';
import { CartItem } from './CartItem';
import { CartHeader } from './CartHeader';

interface CartListProps {
	items: Cart[];
	selectedItems: number[];
	allSelected: boolean;
	onSelectAll: () => void;
	onToggleItem: (itemId: number) => void;
	onDeleteSelected: () => void;
	onRemoveItem: (item: Cart) => void;
}

export const CartList = ({
	items,
	selectedItems,
	allSelected,
	onSelectAll,
	onToggleItem,
	onDeleteSelected,
	onRemoveItem
}: CartListProps) => {
	return (
		<Box flex={1}>
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
					/>
				))}
			</Box>
		</Box>
	);
};
