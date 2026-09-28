import { OrderService } from 'entities/order';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([OrderService]);
