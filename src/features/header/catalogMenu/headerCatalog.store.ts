import 'reflect-metadata';
import { action, atom, computed, withAsyncData, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import type { TopCategory } from 'entities/catalog';
import { HeaderCatalogService } from './headerCatalog.service';

@injectable()
export class HeaderCatalogStore {
	readonly menuAnchor = atom<HTMLElement | null>(null, 'headerCatalog.menuAnchor');
	readonly isMenuOpened = computed(() => this.menuAnchor() !== null, 'headerCatalog.isMenuOpened');
	private readonly hoveredCategory = atom<TopCategory | null>(null, 'headerCatalog.hoveredCategory');

	readonly topCategories = action(async () => {
		return await wrap(this.headerCatalogService.fetchTopCategories());
	}, 'headerCatalog.topCategories').extend(withAsyncData({ initState: [] as TopCategory[] }));

	readonly activeCategory = computed(
		() => this.hoveredCategory() ?? this.topCategories.data()[0] ?? null,
		'headerCatalog.activeCategory'
	);

	constructor(@inject(HeaderCatalogService) private readonly headerCatalogService: HeaderCatalogService) {}

	openMenu(anchor: HTMLElement, isMobile: boolean) {
		if (isMobile) {
			this.headerCatalogService.openMobileCatalog();
			return;
		}
		this.menuAnchor.set(anchor);
		this.topCategories();
	}

	closeMenu() {
		this.menuAnchor.set(null);
	}

	hoverCategory(category: TopCategory) {
		this.hoveredCategory.set(category);
	}
}
