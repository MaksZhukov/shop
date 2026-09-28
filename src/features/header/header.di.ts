import { CatalogService } from 'entities/catalog';
import { SparePartService } from 'entities/sparePart';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector([CatalogService, SparePartService]);
