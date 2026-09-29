import type { ReactNode } from 'react';
import { CartStore } from 'entities/cart';
import { FavoriteStore } from 'entities/favorite';
import { UserService, UserStore } from 'entities/user';
import { CartInjector, CartListService } from 'features/cart';
import { FavoriteListService, FavoritesInjector } from 'features/favorites';
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
	const cartStore = useInjection(CartStore);
	const cartListService = useInjection(CartListService);
	const favoriteStore = useInjection(FavoriteStore);
	const favoriteListService = useInjection(FavoriteListService);

	return (
		<UserInjector value={{ userService, userStore, authModalStore }}>
			<CartInjector value={{ cartStore, cartListService }}>
				<FavoritesInjector value={{ favoriteStore, favoriteListService }}>
					<FooterInjector value={{ userStore, openAuth: () => authModalStore.open() }}>
						<RouteShieldInjector value={{ userStore }}>{children}</RouteShieldInjector>
					</FooterInjector>
				</FavoritesInjector>
			</CartInjector>
		</UserInjector>
	);
};
