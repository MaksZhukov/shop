import { Brand } from "api/brands/types";
import { Model } from "api/models/types";
import { Image } from "api/types";

export interface KindSparePart {
  id: number;
  name: string;
}

export interface SparePart {
  id: number;
  type: "sparePart";
  slug: string;
  name: string;
  volume: number;
  description: string;
  price: number;
  priceUSD?: number;
  model?: Model;
  brand?: Brand;
  kindSparePart?: SparePart;
  images?: Image[];
  transmission: string;
  generation: string;
}
