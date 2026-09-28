import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { KIND_SPARE_PART_API, KindSparePartApi } from './kindSparePart.api';
import type { KindSparePartReader } from './ports/kindSparePart.port';
import type { CollectionParams } from 'shared/api/types';
import type { KindSparePartDto } from './dto/kindSparePart.dto';

@injectable()
export class KindSparePartService implements KindSparePartReader {
	constructor(@inject(KIND_SPARE_PART_API) private readonly kindSparePartApi: KindSparePartApi) {}

	fetchKindSpareParts<T extends KindSparePartDto>(params: CollectionParams, { abortController }: { abortController?: AbortController } = {}) {
		return this.kindSparePartApi.fetchKindSpareParts<T>(params, { abortController });
	}
}
