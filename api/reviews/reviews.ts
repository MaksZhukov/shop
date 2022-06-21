import { api } from "api";
import { ApiResponse } from "api/types";
import { Review } from "./types";



export const addReview = (data: Review): Promise<ApiResponse<Review>> => api.post('/reviews', data)