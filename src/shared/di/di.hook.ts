import { useContext, useState } from 'react';
import { DiContext } from './di.context';
import type { BoundValue } from './di.util';

type AppContainer = typeof import('app/di/app.tokens').appContainer;
type AppBindings = import('app/di/app.tokens').AppBindings;
type AllowedTokens = ReturnType<AppContainer['getKeys']>[number];
type NonEmptyTokensArray<T extends AllowedTokens = AllowedTokens> = readonly [T, ...T[]];

const useDiContext = () => {
	const container = useContext(DiContext);
	if (!container) {
		throw new Error('DiProvider is missing');
	}
	return container;
};

export function useInjection<T extends AllowedTokens>(token: T): BoundValue<AppBindings, T> {
	const container = useDiContext();
	const [service] = useState(() => container.get(token as never) as BoundValue<AppBindings, T>);
	return service;
}

export function createModuleInjector<const T extends NonEmptyTokensArray>(
	tokens: T
): <Token extends T[number]>(token: Token) => BoundValue<AppBindings, Token> {
	const allowed = new Set<AllowedTokens>(tokens);

	return function useInject<Token extends T[number]>(token: Token) {
		if (!allowed.has(token)) {
			throw new Error(
				`Token is not registered in this module injector. Allowed tokens: ${tokens.map(String).join(', ')}`
			);
		}

		return useInjection(token);
	};
}
