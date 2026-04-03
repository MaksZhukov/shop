import { createContext } from 'react';
import { SparePartsCatalogFilterStore } from './store/sparePartsCatalogFilterStore';

export const SparePartsCatalogFiltersStoreContext = createContext<SparePartsCatalogFilterStore | null>(
	null,
);
