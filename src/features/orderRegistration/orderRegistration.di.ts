import type { OrderService } from 'entities/order';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<typeof OrderService>();
