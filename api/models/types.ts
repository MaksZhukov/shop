import { SEO } from 'api/types';

export interface Model {
    id: number;
    name: string;
    slug: string;
    seoSpareParts: SEO;
    seoWheels: SEO;
    seoCabins: SEO;
}
