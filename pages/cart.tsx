import { Box, Typography } from '@mui/material';
import { Loader, WhiteBox } from 'components/ui';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { ViewedProducts } from 'components/features/ViewedProducts';
import { useStore } from 'store';
import { observer } from 'mobx-react';
import { AnyQuestionsLeft } from 'components/features/AnyQuestionsLeft';
import { useState, useEffect } from 'react';
import { EmptyCart, CartList, CartSummary } from 'components/features/pages/cart';

interface Props {}

const Cart: NextPage<Props> = observer(() => {
	const store = useStore();
	const shoppingCartItems = store.shoppingCart.items;
	const isLoading = store.shoppingCart.isLoading || !store.isInitialRequestDone;
	const [selectedItems, setSelectedItems] = useState<number[]>([]);

	const allSelected =
		shoppingCartItems.length > 0 && shoppingCartItems.every((item) => selectedItems.includes(item.id));

	const handleSelectAll = () => {
		if (allSelected) {
			setSelectedItems([]);
		} else {
			setSelectedItems(shoppingCartItems.map((item) => item.id));
		}
	};

	const handleToggleItem = (itemId: number) => {
		setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
	};

	const handleDeleteSelected = async () => {
		if (selectedItems.length > 0) {
			await store.shoppingCart.removeFromShoppingCartMany(selectedItems);
			setSelectedItems([]);
		}
	};

	const handleRemoveItem = async (item: (typeof shoppingCartItems)[0]) => {
		await store.shoppingCart.removeFromShoppingCart(item);
	};

	const selectedCartItems = shoppingCartItems.filter((item) => !item.product.sold && selectedItems.includes(item.id));
	const selectedTotal = selectedCartItems.reduce(
		(acc, item) => acc + (item.product.discountPrice || item.product.price),
		0
	);

	useEffect(() => {
		setSelectedItems((prev) => prev.filter((id) => shoppingCartItems.some((item) => item.id === id)));
	}, [shoppingCartItems]);

	const handleCheckout = () => {
		// TODO: Implement checkout navigation
	};

	if (isLoading) {
		return <Loader />;
	}

	const renderCartContent = () => {
		if (shoppingCartItems.length === 0) {
			return <EmptyCart />;
		}

		return (
			<>
				<Typography variant='h6' component='h1' mb={2}>
					Корзина
				</Typography>
				<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={1}>
					<CartList
						items={shoppingCartItems}
						selectedItems={selectedItems}
						allSelected={allSelected}
						onSelectAll={handleSelectAll}
						onToggleItem={handleToggleItem}
						onDeleteSelected={handleDeleteSelected}
						onRemoveItem={handleRemoveItem}
					/>
					<CartSummary
						selectedItemsCount={selectedCartItems.length}
						totalAmount={selectedTotal}
						onCheckout={handleCheckout}
					/>
				</Box>
			</>
		);
	};

	const renderMobileQuestions = () => (
		<WhiteBox display={{ xs: 'block', md: 'none' }} borderRadius={0} ml={-2} mr={-2} pt={3} pb={1} mt={3} px={1}>
			<AnyQuestionsLeft />
		</WhiteBox>
	);

	return (
		<Box pt={2} pb={{ xs: 0, md: 2 }}>
			{renderCartContent()}
			<ViewedProducts />
			{renderMobileQuestions()}
		</Box>
	);
});

export default Cart;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' }
		]
	}
}));
