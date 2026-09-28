import type { CatalogService } from 'entities/catalog';
import type { SparePartService } from 'entities/sparePart';
import { createModuleInjector } from 'shared/di';

export const inject = createModuleInjector<typeof CatalogService | typeof SparePartService>();
