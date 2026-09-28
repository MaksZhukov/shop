import { useContext, useState } from 'react';
import { DiContext } from './di.context';
import type { BoundValue } from './di.util';

type AppContainer = typeof import('app/di/app.tokens').appContainer;
type AppBindings = import('app/di/app.tokens').AppBindings;
type AllowedTokens = ReturnType<AppContainer['getKeys']>[number];

const useDiContext = () => {
	const container = useContext(DiContext);
	if (!container) {
		throw new Error('DiProvider is missing');
	}
	return container;
};

export function useInjection<T extends AllowedTokens>(token: T): BoundValue<AppBindings, T> {
	const container = useDiContext();
	const [service] = useState(() => container.get(token) as BoundValue<AppBindings, T>);
	return service;
}

export function createModuleInjector<T extends AllowedTokens>() {
	return function useInject<Token extends T>(token: Token) {
		return useInjection(token);
	};
}
