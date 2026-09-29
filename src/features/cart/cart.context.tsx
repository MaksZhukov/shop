import { createContext, type ReactNode } from 'react';
import type { CartStore } from 'entities/cart';
import type { CartListService } from './cartList.service';

export type CartContextValue = {
	cartStore: CartStore;
	cartListService: CartListService;
};

export const CartContext = createContext<CartContextValue | null>(null);

type CartInjectorProps = {
	value: CartContextValue;
	children: ReactNode;
};

export const CartInjector = ({ value, children }: CartInjectorProps) => (
	<CartContext.Provider value={value}>{children}</CartContext.Provider>
);
