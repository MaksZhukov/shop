import type { AutocomiseService } from 'entities/autocomise';
import type { EmailService } from 'entities/email';
import type { PageService } from 'entities/page';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	| typeof AutocomiseService
	| typeof EmailService
	| typeof PageService
>();
