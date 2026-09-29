import 'reflect-metadata';
import { reatomBoolean } from '@reatom/core';
import { inject, injectable } from 'inversify';
import { HeaderService } from './header.service';

@injectable()
export class HeaderStore {
	readonly isMobileMenuOpened = reatomBoolean(false, 'header.isMobileMenuOpened');

	constructor(@inject(HeaderService) private readonly headerService: HeaderService) {}

	openMobileMenuLink(href: string) {
		this.isMobileMenuOpened.setFalse();
		this.headerService.navigate(href);
	}
}
