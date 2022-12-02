import { Image, SEO } from "api/types";

export interface Vacancy {
  id: number;
  name: string;
  image: Image;
  description: string;
  slug: string;
  seo: SEO;
}
