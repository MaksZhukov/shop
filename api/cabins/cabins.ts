import getConfig from 'next/config';
import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { Cabin } from './types';
const { publicRuntimeConfig } = getConfig();

export const fetchCabins = (params?: CollectionParams, isServerRequest = false) =>
    api.get<ApiResponse<Cabin[]>>('/cabins', {
        params,
        headers: { isServerRequest },
    });

export const fetchCabin = (idOrSlug: string, isServerRequest = false) =>
    api.get<ApiResponse<Cabin>>(`/cabins/${idOrSlug}`, {
        params: { populate: 'images' },
        headers: { isServerRequest },
    });
