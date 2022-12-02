import { api } from "api";
import { ApiResponse, CollectionParams } from "api/types";
import { Vacancy } from "./types";

export const fetchVacancies = (
  params: CollectionParams,
  isServerRequest: boolean = false
) =>
  api.get<ApiResponse<Vacancy[]>>("/vacancies", {
    params,
    headers: { isServerRequest },
  });

export const fetchVacancy = (slug: string, isServerRequest = false) =>
  api.get<ApiResponse<Vacancy>>(`/vacancies/${slug}`, {
    headers: { isServerRequest },
  });
