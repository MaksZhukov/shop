import type { CatalogReference } from '../ui/types';

export const mapToCatalogReferences = (
	items: Array<{ id: number; name: string; path: string; count?: number }>
): CatalogReference[] =>
	items.map(({ id, name, path, count }) => ({
		id,
		label: name,
		href: path,
		count
	}));
