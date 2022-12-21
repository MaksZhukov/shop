import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { WheelDiameterCenterHole } from './types';

export const fetchWheelDiameterCenterHoles = (params?: CollectionParams) =>
	api.get<ApiResponse<WheelDiameterCenterHole[]>>('/wheel-diameter-center-holes', { params });
