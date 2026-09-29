import 'reflect-metadata';
import { atom, computed } from '@reatom/core';
import { inject, injectable } from 'inversify';
import { UserStore } from 'entities/user';
import { HeaderService } from '../header.service';

const PROFILE_PATH = '/profile';

@injectable()
export class UserMenuStore {
	readonly menuAnchor = atom<HTMLElement | null>(null, 'userMenu.menuAnchor');
	readonly isMenuOpened = computed(() => this.menuAnchor() !== null, 'userMenu.isMenuOpened');

	constructor(
		@inject(HeaderService) private readonly headerService: HeaderService,
		@inject(UserStore) private readonly userStore: UserStore
	) {}

	clickProfile(anchor: HTMLElement) {
		if (this.userStore.id) {
			this.menuAnchor.set(anchor);
		} else {
			this.headerService.openAuth();
		}
	}

	closeMenu() {
		this.menuAnchor.set(null);
	}

	openProfile() {
		this.closeMenu();
		this.headerService.navigate(PROFILE_PATH);
	}

	logout() {
		this.closeMenu();
		return this.headerService.logout();
	}
}
