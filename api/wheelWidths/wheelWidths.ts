import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { WheelWidth } from './types';

export const fetchWheelWidths = (params?: CollectionParams) =>
	api.get<ApiResponse<WheelWidth[]>>('/wheel-widths', { params });
