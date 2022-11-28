import { Image } from "api/types";

export interface Article {
  id: number;
  name: string;
  image: Image;
  description: string;
  type: string;
}
