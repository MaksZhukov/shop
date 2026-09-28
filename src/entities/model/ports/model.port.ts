import type { ModelApi } from '../model.api';

export type ModelReader = Pick<ModelApi, 'fetchModels' | 'fetchModelBySlug'>;
