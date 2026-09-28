import type { AutocomiseService } from 'entities/autocomise';
import type { EmailService } from 'entities/email';
import type { PageService } from 'entities/page';
import type { ReviewService } from 'entities/review';
import type { ServiceStationService } from 'entities/serviceStation';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<
	| typeof AutocomiseService
	| typeof EmailService
	| typeof PageService
	| typeof ReviewService
	| typeof ServiceStationService
>();
