import type { PageApi } from '../page.api';

export type PageReader = Pick<PageApi, 'fetchPage'>;
