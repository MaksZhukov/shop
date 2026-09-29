import { createContext, type ReactNode } from 'react';
import type { CabinService } from 'entities/cabin';
import type { CartService, CartStore } from 'entities/cart';
import type { SparePartService } from 'entities/sparePart';
import type { TireService } from 'entities/tire';
import type { UserStore } from 'entities/user';
import type { WheelService } from 'entities/wheel';

export type CartContextValue = {
	cabinService: CabinService;
	cartService: CartService;
	sparePartService: SparePartService;
	tireService: TireService;
	wheelService: WheelService;
	userStore: UserStore;
	cartStore: CartStore;
};

export const CartContext = createContext<CartContextValue | null>(null);

type CartInjectorProps = {
	value: CartContextValue;
	children: ReactNode;
};

export const CartInjector = ({ value, children }: CartInjectorProps) => (
	<CartContext.Provider value={value}>{children}</CartContext.Provider>
);
