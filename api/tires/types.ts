import { Order } from 'api/orders/types';
import { TireBrand } from 'api/tireBrands/types';
import { TireDiameter } from 'api/tireDiameters/types';
import { TireHeight } from 'api/tireHeights/types';
import { TireWidth } from 'api/tireWidths/types';
import { Image, ProductSnippets, SEO } from 'api/types';

export type Season = 'зимние' | 'летние' | 'всесезонные';

export interface Tire {
    id: number;
    type: 'tire';
    h1: string;
    name: string;
    slug: string;
    diameter: TireDiameter;
    width: TireWidth;
    height: TireHeight;
    season: Season;
    brand: TireBrand;
    price: number;
    priceUSD: number;
    discountPrice: number;
    discountPriceUSD: number;
    count: number;
    description: string;
    images: Image[];
    seo?: SEO;
    snippets?: ProductSnippets;
    sold: boolean;
}
