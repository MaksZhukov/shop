import { api } from "api";
import { KindSparePart } from "api/spareParts/types";
import { ApiResponse, CollectionParams } from "api/types";

export const fetchKindSpareParts = (params: CollectionParams) =>
  api.get<ApiResponse<KindSparePart[]>>("/kind-spare-parts", { params });
