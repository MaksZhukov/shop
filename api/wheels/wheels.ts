import getConfig from "next/config";
import { api } from "..";
import { ApiResponse, CollectionParams } from "../types";
import { Wheel } from "./types";
const { publicRuntimeConfig } = getConfig();

export const fetchWheels = (params?: CollectionParams) =>
  api.get<ApiResponse<Wheel[]>>("/wheels", { params });

export const fetchWheel = (idOrSlug: string, isServerRequest = false) =>
  api.get<ApiResponse<Wheel>>(`/wheels/${idOrSlug}`, {
    params: { populate: "images" },
    ...(isServerRequest
      ? { baseURL: publicRuntimeConfig.backendLocalUrl + "/api" }
      : {}),
  });
