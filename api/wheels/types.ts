import { Image } from "api/types";

export interface Wheel {
  id: number;
  type: "wheel";
  name: string;
  slug: string;
  diameter: string;
  width: number;
  height: number;
  brand: string;
  price: number;
  priceUSD: number;
  images: Image[];
}
