import { Box, Typography } from '@mui/material';
import { Loader, MobileQuestionsSection } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { ViewedProducts } from 'features/product';
import { useStore } from 'app/providers/StoreProvider';
import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import { EmptyCart, CartList } from 'widgets/cart';
import { OrderSummary } from 'features/orderRegistration';
import { useRemoveCartMany } from 'features/cart/useRemoveCartMany';
import { useRemoveCart } from 'features/cart/useRemoveCart';
import router from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { Cart } from 'entities/cart';

interface Props {}

const Cart: NextPage<Props> = observer(() => {
	const store = useStore();
	const removeCartMany = useRemoveCartMany();
	const removeCart = useRemoveCart();
	const shoppingCartItems = store.cart.items;
	const isLoading = store.cart.isLoading || !store.isInitialRequestDone;
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
			await removeCartMany(selectedItems);
			setSelectedItems([]);
		}
	};

	const handleRemoveItem = async (item: (typeof shoppingCartItems)[0]) => {
		await removeCart(item);
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
		store.cart.setSelectedItemsForCheckout(selectedItems);
		router.push('/order-registration', undefined, { shallow: true });
	};

	const handleClickBuy = (item: Cart) => {
		store.cart.setSelectedItemsForCheckout([item.id]);
		router.push('/order-registration', undefined, { shallow: true });
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
						onClickBuy={handleClickBuy}
					/>
					<OrderSummary
						selectedItemsCount={selectedCartItems.length}
						totalAmount={selectedTotal}
						onCheckout={handleCheckout}
						disclaimerText='Доступные способы и условия доставки можно узнать при оформлении заказа'
					/>
				</Box>
			</>
		);
	};

	return (
		<Box pt={2} pb={{ xs: 0, md: 2 }}>
			{renderCartContent()}
			<ViewedProducts />
			<MobileQuestionsSection />
		</Box>
	);
});

export default Cart;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		page: {
			seo: {
				title: 'Корзина',
				description: 'Корзина',
				keywords: 'Корзина'
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' }
		]
	}
}));
