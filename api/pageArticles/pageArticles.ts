import { api } from "api";
import { ApiResponse } from "api/types";
import getConfig from "next/config";
import { PageArticles } from "./types";
const { publicRuntimeConfig } = getConfig();

export const fetchPageArticles = () =>
  api.get<ApiResponse<PageArticles>>(`/page-article`, {
    baseURL: publicRuntimeConfig.backendLocalUrl + "/api",
  });
