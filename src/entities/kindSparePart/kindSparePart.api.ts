import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { KindSparePartDto } from './dto/kindSparePart.dto';

export const KIND_SPARE_PART_API = Symbol('KindSparePartApi');

@injectable()
export class KindSparePartApi {
	fetchKindSpareParts<T extends KindSparePartDto>(params: CollectionParams, { abortController }: { abortController?: AbortController } = {}) {
		return api.get<ApiResponse<T[]>>('/kind-spare-parts', { params, signal: abortController?.signal });
	}
}

export const kindSparePartApi = new KindSparePartApi();

