export interface Product {
    id: number;
    slug: string;
    name: string;
    description: string;
    price: number;
    priceUSD?: number;
    images?: {
        id: number;
        url: string;
        formats: {
            thumbnail: { url: string };
            small: { url: string };
        };
    }[];
}
