import { AutocomiseService } from 'entities/autocomise';
import { EmailService } from 'entities/email';
import { PageService } from 'entities/page';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([AutocomiseService, EmailService, PageService]);
