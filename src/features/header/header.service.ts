import 'reflect-metadata';
import { action, withAsync, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import Router from 'next/router';
import { HEADER_SESSION, type HeaderSession } from './ports/header.port';

@injectable()
export class HeaderService {
	readonly logout = action(async () => {
		await wrap(this.session.logout());
		await wrap(Router.push('/', undefined, { shallow: true }));
	}, 'header.logout').extend(withAsync());

	constructor(@inject(HEADER_SESSION) private readonly session: HeaderSession) {}

	openAuth() {
		this.session.openAuth();
	}

	navigate(href: string) {
		return Router.push(href);
	}
}
