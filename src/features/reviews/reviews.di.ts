import { createModuleInjector } from 'shared/di';
import type { ReviewsStore } from './reviews.store';

export const inject = createModuleInjector<typeof ReviewsStore>();
