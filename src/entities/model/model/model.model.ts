import type {
	ModelCabinsCountDto,
	ModelCabinsCountWithGenerationsCabinsCountDto,
	ModelDto,
	ModelSparePartsCountDto,
	ModelSparePartsCountWithGenerationsSparePartsCountDto,
	ModelWheelsCountWithGenerationsWheelsCountDto
} from '../dto/model.dto';

export type Model = ModelDto;
export type ModelSparePartsCount = ModelSparePartsCountDto;
export type ModelSparePartsCountWithGenerationsSparePartsCount =
	ModelSparePartsCountWithGenerationsSparePartsCountDto;
export type ModelCabinsCount = ModelCabinsCountDto;
export type ModelCabinsCountWithGenerationsCabinsCount = ModelCabinsCountWithGenerationsCabinsCountDto;
export type ModelWheelsCountWithGenerationsWheelsCount = ModelWheelsCountWithGenerationsWheelsCountDto;
