import getConfig from "next/config";
import { api } from "..";
import { ApiResponse, CollectionParams } from "../types";
import { Tire } from "./types";
const { publicRuntimeConfig } = getConfig();

export const fetchTires = (params?: CollectionParams) =>
  api.get<ApiResponse<Tire[]>>("/tires", { params });

export const fetchTire = (idOrSlug: string, isServerRequest = false) =>
  api.get<ApiResponse<Tire>>(`/tires/${idOrSlug}`, {
    params: { populate: "images" },
    ...(isServerRequest
      ? { baseURL: publicRuntimeConfig.backendLocalUrl + "/api" }
      : {}),
  });
