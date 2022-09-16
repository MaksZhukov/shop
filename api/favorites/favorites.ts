import { api } from "..";
import { ApiResponse } from "../types";
import { Favorite } from "./types";

export const getFavorites = () => api.get<ApiResponse<Favorite>>("favorites");

export const changeFavorites = (
  id: number,
  data: {
    sparePart: number[];
    wheel: number[];
    tire: number[];
  }
) =>
  api.put<ApiResponse<Favorite>>("favorites/" + id, {
    data: { spareParts: data.sparePart, wheels: data.wheel, tires: data.tire },
  });
