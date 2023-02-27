import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { Order } from 'api/orders/types';
import { Image, ProductSnippets, SEO } from 'api/types';
import { WheelDiameterCenterHole } from 'api/wheelDiameterCenterHoles/types';
import { WheelDiameter } from 'api/wheelDiameters/types';
import { WheelDiskOffset } from 'api/wheelDiskOffsets/types';
import { WheelNumberHole } from 'api/wheelNumberHoles/types';
import { WheelWidth } from 'api/wheelWidths/types';

export interface Wheel {
    id: number;
    type: 'wheel';
    h1: string;
    name: string;
    slug: string;
    diameter: WheelDiameter;
    numberHoles: WheelNumberHole;
    kind: 'литой' | 'штампованный';
    diameterCenterHole: WheelDiameterCenterHole;
    diskOffset: WheelDiskOffset;
    distanceBetweenCenters: number;
    width: WheelWidth;
    height: number;
    brand: Brand;
    model: Model;
    price: number;
    priceUSD: number;
    discountPrice: number;
    discountPriceUSD: number;
    count: number;
    description: string;
    images: Image[];
    seo?: SEO;
    snippets?: ProductSnippets;
    order?: Order;
}
