import { CartStore } from 'entities/cart';
import { FavoriteStore } from 'entities/favorite';
import { UserStore } from 'entities/user';
import { createModuleInjector } from 'shared/di';
import { HeaderInjector } from '../header.context';
import { HeaderStore } from '../header.store';
import { HeaderCatalogStore } from '../catalogMenu';
import { HeaderSearchStore } from '../search';
import { UserMenuStore } from '../userMenu';
import { Header } from './header.component';

const injectHeader = createModuleInjector([
	HeaderStore,
	HeaderSearchStore,
	HeaderCatalogStore,
	UserMenuStore,
	UserStore,
	CartStore,
	FavoriteStore
]);

export const HeaderWrapper = () => {
	const headerStore = injectHeader(HeaderStore);
	const headerSearchStore = injectHeader(HeaderSearchStore);
	const headerCatalogStore = injectHeader(HeaderCatalogStore);
	const userMenuStore = injectHeader(UserMenuStore);
	const userStore = injectHeader(UserStore);
	const cartStore = injectHeader(CartStore);
	const favoriteStore = injectHeader(FavoriteStore);

	return (
		<HeaderInjector
			value={{
				headerStore,
				headerSearchStore,
				headerCatalogStore,
				userMenuStore,
				userStore,
				cartStore,
				favoriteStore
			}}
		>
			<Header />
		</HeaderInjector>
	);
};
