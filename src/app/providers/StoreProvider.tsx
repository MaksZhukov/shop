import { FC, ReactNode } from 'react';
import { enableStaticRendering } from 'mobx-react';
import { CartStoreProvider } from './CartStoreProvider';
import { FavoriteStoreProvider } from './FavoriteStoreProvider';
import { SparePartsCatalogFiltersStoreProvider } from './SparePartsCatalogFiltersStoreProvider';
import { UserStoreProvider } from './UserStoreProvider';

enableStaticRendering(typeof window === 'undefined');

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<FavoriteStoreProvider>
			<CartStoreProvider>
				<SparePartsCatalogFiltersStoreProvider>
					<UserStoreProvider>{children}</UserStoreProvider>
				</SparePartsCatalogFiltersStoreProvider>
			</CartStoreProvider>
		</FavoriteStoreProvider>
	);
};
