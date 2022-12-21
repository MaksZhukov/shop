import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { WheelNumberHole } from './types';

export const fetchWheelNumberHoles = (params?: CollectionParams) =>
	api.get<ApiResponse<WheelNumberHole[]>>('/wheel-disk-offsets', { params });
