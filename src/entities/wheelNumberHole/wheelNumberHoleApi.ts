import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { WheelNumberHoleDto } from './dto/wheelNumberHole.dto';

export const wheelNumberHoleApi = {
	fetchWheelNumberHoles: (params?: CollectionParams) =>
		api.get<ApiResponse<WheelNumberHoleDto[]>>('/wheel-disk-offsets', { params })
};
