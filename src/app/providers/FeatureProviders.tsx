import type { ReactNode } from 'react';
import { CabinService } from 'entities/cabin';
import { CartService, CartStore } from 'entities/cart';
import { FavoriteService, FavoriteStore } from 'entities/favorite';
import { SparePartService } from 'entities/sparePart';
import { TireService } from 'entities/tire';
import { UserService, UserStore } from 'entities/user';
import { WheelService } from 'entities/wheel';
import { CartInjector } from 'features/cart';
import { FavoritesInjector } from 'features/favorites';
import { FooterInjector } from 'features/footer';
import { RouteShieldInjector } from 'features/routeShield';
import { AuthModalStore, UserInjector } from 'features/user';
import { useInjection } from 'shared/di/di.hook';

type FeatureProvidersProps = {
	children: ReactNode;
};

// Session features render on almost every page and in _app, so app provides their bound context once.
export const FeatureProviders = ({ children }: FeatureProvidersProps) => {
	const userService = useInjection(UserService);
	const userStore = useInjection(UserStore);
	const authModalStore = useInjection(AuthModalStore);
	const cartService = useInjection(CartService);
	const cartStore = useInjection(CartStore);
	const favoriteService = useInjection(FavoriteService);
	const favoriteStore = useInjection(FavoriteStore);
	const sparePartService = useInjection(SparePartService);
	const wheelService = useInjection(WheelService);
	const tireService = useInjection(TireService);
	const cabinService = useInjection(CabinService);
	const products = { cabinService, sparePartService, tireService, wheelService };

	return (
		<UserInjector value={{ userService, userStore, authModalStore }}>
			<CartInjector value={{ ...products, cartService, userStore, cartStore }}>
				<FavoritesInjector value={{ ...products, favoriteService, userStore, favoriteStore }}>
					<FooterInjector value={{ userStore, openAuth: () => authModalStore.open() }}>
						<RouteShieldInjector value={{ userStore }}>{children}</RouteShieldInjector>
					</FooterInjector>
				</FavoritesInjector>
			</CartInjector>
		</UserInjector>
	);
};
