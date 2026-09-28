import { UserService } from 'entities/user';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([UserService]);
