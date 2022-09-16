import { Image } from "api/types";

export type Season = "зимние" | "летние" | "всесезонные";

export interface Tire {
  id: number;
  type: "tire";
  name: string;
  slug: string;
  diameter: string;
  width: number;
  height: number;
  season: Season;
  brand: string;
  price: number;
  priceUSD: number;
  images: Image[];
}
