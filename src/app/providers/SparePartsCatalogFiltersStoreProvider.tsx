import { SparePartsCatalogFilterStore } from 'features/sparePartsCatalog';
import { SparePartsCatalogFiltersStoreContext } from 'features/sparePartsCatalog/sparePartsCatalogFiltersContext';

const sparePartsCatalogFiltersStore = new SparePartsCatalogFilterStore();

export const SparePartsCatalogFiltersStoreProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SparePartsCatalogFiltersStoreContext.Provider value={sparePartsCatalogFiltersStore}>
			{children}
		</SparePartsCatalogFiltersStoreContext.Provider>
	);
};
