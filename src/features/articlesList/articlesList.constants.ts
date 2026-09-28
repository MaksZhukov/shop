export type SortItem = {
	value: string;
	name: string;
};

export const DEFAULT_SORT = 'createdAt:desc';
export const LIMIT = 12;

export const SORT_ITEMS: SortItem[] = [
	{ value: 'createdAt:desc', name: 'Новые' },
	{ value: 'createdAt:asc', name: 'Старые' }
];
