import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import { SparePartsCatalogFilterStore } from '../store/sparePartsCatalogFilterStore';

export const useSparePartsCatalogFiltersStore = () => {
	const { store } = useContext(MobXProviderContext) as {
		store: { sparePartsCatalogFilters: SparePartsCatalogFilterStore };
	};
	return store.sparePartsCatalogFilters;
};
