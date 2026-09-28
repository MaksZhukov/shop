import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseRouterQuery } from '../utils';
import { useSparePartsCatalogFiltersStore } from './useSparePartsCatalogFiltersStore';

export const useSyncSparePartsCatalogFiltersFromRouter = () => {
	const router = useRouter();
	const sparePartsCatalogFiltersStore = useSparePartsCatalogFiltersStore();

	useEffect(() => {
		sparePartsCatalogFiltersStore.syncFromQueryParams(parseRouterQuery(router.query));
	}, [router.query, sparePartsCatalogFiltersStore]);
};
