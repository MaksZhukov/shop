import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { WheelDistanceBetweenCenter } from './types';

export const fetchWheelDistanceBetweenCenters = (params?: CollectionParams) =>
	api.get<ApiResponse<WheelDistanceBetweenCenter[]>>('/wheel-distance-between-centers', { params });
