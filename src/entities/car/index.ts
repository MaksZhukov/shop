export { CAR_API, CarApi } from './car.api';
export { CarService } from './car.service';
export type { CarReader } from './ports/car.port';
export type { Car, Fuel } from './model/car.model';
export {
	FUELS_SLUGIFY,
	SLUGIFY_FUELS,
	BODY_STYLES_SLUGIFY,
	SLUGIFY_BODY_STYLES,
	TRANSMISSIONS_SLUGIFY,
	SLUGIFY_TRANSMISSIONS
} from './carConfig';
export {
	FUELS,
	FUELS_OPTIONS,
	TRANSMISSIONS,
	TRANSMISSIONS_OPTIONS,
	BODY_STYLES,
	BODY_STYLES_OPTIONS
} from './carConstants';
