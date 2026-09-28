import type { GenerationApi } from '../generation.api';

export type GenerationReader = Pick<GenerationApi, 'fetchGenerations' | 'fetchGeneration'>;
