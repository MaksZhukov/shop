export type Season = "зимние" | "летние" | "всесезонные";

export interface Tire {
  id: string;
  diameter: string;
  width: number;
  height: number;
  season: Season;
  brand: string;
  price: number;
  priceUSD: number;
}
