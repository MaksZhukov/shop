import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { generateSparePartsFiltersByQuery, sparePartsCatalogFilterStore } from 'features/catalog';
import type { HeaderCatalogFilters, HeaderSession } from 'features/header';
import { ProfileService } from 'features/profile';
import { AuthModalStore } from 'features/user';

@injectable()
export class HeaderSessionAdapter implements HeaderSession {
	constructor(
		@inject(ProfileService) private readonly profileService: ProfileService,
		@inject(AuthModalStore) private readonly authModalStore: AuthModalStore
	) {}

	logout() {
		return this.profileService.logout();
	}

	openAuth() {
		this.authModalStore.open();
	}
}

@injectable()
export class HeaderCatalogFiltersAdapter implements HeaderCatalogFilters {
	// Only while the spare parts catalog is on screen, so the header search follows its filters.
	getFilters() {
		if (!sparePartsCatalogFilterStore.isActive) {
			return {};
		}
		return generateSparePartsFiltersByQuery(sparePartsCatalogFilterStore.filtersValues);
	}
}
