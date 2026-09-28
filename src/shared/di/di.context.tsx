import { createContext, type ReactNode } from 'react';
import type { Container } from 'inversify';

export const DiContext = createContext<Container | null>(null);

export const DiProvider = ({ container, children }: { container: Container; children: ReactNode }) => (
	<DiContext.Provider value={container}>{children}</DiContext.Provider>
);
