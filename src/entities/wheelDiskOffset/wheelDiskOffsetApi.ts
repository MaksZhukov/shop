import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiskOffset } from './model/wheelDiskOffsetModel';

export const wheelDiskOffsetApi = {
	fetchWheelDiskOffsets: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiskOffset[]>>('/wheel-disk-offsets', { params })
};



