import { api } from "api";
import { ApiResponse, CollectionParams } from "api/types";
import { Brand } from "./types";

export const fetchBrands = (
  params: CollectionParams,
  isServerRequest: boolean = false
) =>
  api.get<ApiResponse<Brand[]>>("/brands", {
    params,
    headers: { isServerRequest },
  });
