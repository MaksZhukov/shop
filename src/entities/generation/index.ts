export { GENERATION_API, GenerationApi, generationApi } from './generation.api';
export { GenerationService } from './generation.service';
export type { GenerationReader } from './ports/generation.port';
export type {
	Generation,
	GenerationWithModelAndBrand,
	GenerationWithSparePartsCount,
	GenerationWithCabinsCount,
	GenerationWithWheelsCount
} from './model/generation.model';
export { withGeneration } from './generationUtils';
