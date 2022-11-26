import { api } from "..";
import { ApiResponse, CollectionParams, Product } from "../types";
import { Order } from "./types";

export const createOrder = (data: Omit<Order, "id">) =>
  api.post<ApiResponse<Order>>("/orders", {
    data: {
      ...data,
      products: data.products.map((item) => ({
        __component: `product.${
          item.type === "sparePart" ? "spare-part" : item.type
        }`,
        product: item.id,
      })),
    },
  });
