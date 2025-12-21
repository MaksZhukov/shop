import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { WheelDiskOffset } from './wheelDiskOffsetTypes';

export const wheelDiskOffsetApi = {
	fetchWheelDiskOffsets: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiskOffset[]>>('/wheel-disk-offsets', { params })
};



