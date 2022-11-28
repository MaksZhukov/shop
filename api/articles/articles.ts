import { api } from "api";
import { ApiResponse, CollectionParams } from "api/types";
import { Article } from "./types";

export const fetchArticles = (
  params: CollectionParams,
  isServerRequest: boolean = false
) =>
  api.get<ApiResponse<Article[]>>("/brands", {
    params,
    headers: { isServerRequest },
  });
