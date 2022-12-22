import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { WheelDiskOffset } from './types';

export const fetchWheelDiskOffsets = (params?: CollectionParams) =>
	api.get<ApiResponse<WheelDiskOffset[]>>('/wheel-disk-offsets', { params });
