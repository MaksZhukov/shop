import type { AutocomiseApi } from '../autocomise.api';

export type AutocomiseReader = Pick<AutocomiseApi, 'fetchAutocomises' | 'fetchAutocomis'>;
