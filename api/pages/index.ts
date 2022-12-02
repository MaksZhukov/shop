import { api } from "api";
import { ApiResponse } from "api/types";
import getConfig from "next/config";
import { DefaultPage } from "./types";
const { publicRuntimeConfig } = getConfig();

export const fetchPage =
  <T = DefaultPage>(pageUrl: string) =>
  () =>
    api.get<ApiResponse<T>>(`/page-${pageUrl}`, {
      baseURL: publicRuntimeConfig.backendLocalUrl + "/api",
    });
