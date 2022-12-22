import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { WheelDiameter } from './types';

export const fetchWheelDiameters = (params?: CollectionParams) =>
	api.get<ApiResponse<WheelDiameter[]>>('/wheel-diameters', { params });
