import { createContext, type ReactNode } from 'react';
import type { DefaultPage } from 'entities/page';
import type { ServiceStationsStore } from './serviceStations.store';

export type ServiceStationsContextValue = {
	serviceStationsStore: ServiceStationsStore;
	page: DefaultPage;
};

export const ServiceStationsContext = createContext<ServiceStationsContextValue | null>(null);

type ServiceStationsInjectorProps = {
	value: ServiceStationsContextValue;
	children: ReactNode;
};

export const ServiceStationsInjector = ({ value, children }: ServiceStationsInjectorProps) => (
	<ServiceStationsContext.Provider value={value}>{children}</ServiceStationsContext.Provider>
);
