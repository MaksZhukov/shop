import { useContext } from 'react';
import { SparePartsCatalogFilterStore } from '../store/sparePartsCatalogFilterStore';
import { SparePartsCatalogFiltersStoreContext } from '../sparePartsCatalogFiltersContext';

export const useSparePartsCatalogFiltersStore = (): SparePartsCatalogFilterStore => {
	const store = useContext(SparePartsCatalogFiltersStoreContext);
	if (!store) {
		throw new Error('SparePartsCatalogFilterStore not found');
	}
	return store;
};
