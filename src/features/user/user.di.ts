import type { UserService } from 'entities/user';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<typeof UserService>();
