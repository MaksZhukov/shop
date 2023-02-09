import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { Image, LinkWithImage, SEO } from 'api/types';

export type DefaultPage = {
    seo: SEO;
};

export type PageMain = {
    seo: SEO | null;
    banner?: Image;
    h1: string;
    subH1: string;
    titleCategories: string;
    categoryImages?: Image[];
    benefits?: Image[];
    autocomises?: Autocomis[];
    serviceStations?: ServiceStation[];
    popularBrandsTitle: string;
    leftSideText: string;
    videoUrl: string;
    reviewsTitle: string;
    benefitsTitle: string;
    benefitsLeftText: string;
    benefitsRightImage?: Image;
    blogTitle: string;
    blogLeftText: string;
    blogRightText: string;
    deliveryTitle: string;
    deliveryText: string;
};

export type PageProduct = {
    linksWithImages: LinkWithImage[];
    benefits: Image[];
};

export type PageProductTire = {
    textAfterDescription: string;
    textAfterBenefits: string;
    seo: SEO;
};

export type PageProductCabin = {
    textAfterDescription: string;
    textAfterBenefits: string;
    seo: SEO;
};

export type PageProductWheel = {
    textAfterDescription: string;
    textAfterBenefits: string;
    seo: SEO;
};

export type PageProductSparePart = {
    textAfterDescription: string;
    autoSynonyms: string;
    textAfterBenefits: string;
    seo: SEO;
};
