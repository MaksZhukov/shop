import { createContext, type ReactNode } from 'react';
import type { VacanciesStore } from './vacancies.store';

export type VacanciesContextValue = {
	vacanciesStore: VacanciesStore;
};

export const VacanciesContext = createContext<VacanciesContextValue | null>(null);

type VacanciesInjectorProps = {
	value: VacanciesContextValue;
	children: ReactNode;
};

export const VacanciesInjector = ({ value, children }: VacanciesInjectorProps) => (
	<VacanciesContext.Provider value={value}>{children}</VacanciesContext.Provider>
);
