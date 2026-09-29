import type { Filters } from 'shared/api/types';

export const HEADER_SESSION = Symbol('HeaderSession');
export const HEADER_CATALOG_FILTERS = Symbol('HeaderCatalogFilters');

export interface HeaderSession {
	logout(): Promise<void>;
	openAuth(): void;
}

export interface HeaderCatalogFilters {
	/** Filters of the spare parts catalog while it is on screen, otherwise `{}`. */
	getFilters(): Filters;
}
