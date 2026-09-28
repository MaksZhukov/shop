import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelDiskOffsetDto } from './dto/wheelDiskOffset.dto';

export const wheelDiskOffsetApi = {
	fetchWheelDiskOffsets: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelDiskOffsetDto[]>>('/wheel-disk-offsets', { params })
};



