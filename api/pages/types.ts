import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { Image, LinkWithImage, SEO, ShortSEO } from 'api/types';

export type DefaultPage = {
    seo: SEO;
};

export type PageMain = {
    seo: SEO | null;
    banner?: Image;
    bannerMobile?: Image;
    h1: string;
    subH1: string;
    titleCategories: string;
    categoryImages?: Image[];
    benefits?: LinkWithImage[];
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

export type PageBuybackCars = {
    seo: SEO | null;
    mainBackgroundImage: Image;
    mainBackgroundLeftImage: Image;
    h1: string;
    weProvideTitle: string;
    weProvide: { image: Image; title: string; description: string }[];
    purchasedCarsTitle: string;
    advantagesTitle: string;
    advantages: string;
    advantagesRightImage: Image;
    buyAnyCarsTitle: string;
    anyCarsAfter: { image: Image; title: string; description: string }[];
    sellCarTitle: string;
    sellSteps: { title: string; description: string }[];
    sellImage: Image;
    applicationLeftText: string;
    whyWeTitle: string;
    whyWe: string;
    whyWeLeftImage: Image;
};

export type Vacancy = {
    id: number;
    title: string;
    image: Image;
    vacancy: string;
    description: { label: string; value: string }[];
    fullTitle: string;
    responsibilities: string;
    requirements: string;
    images: Image[];
};

export type PageVacancies = {
    seo: SEO | null;
    vacancies: Vacancy[];
};

export type PageContacts = {
    seo: ShortSEO | null;
    h1: string;
    phone1: string;
    phone2: string;
    location: string;
    askTitle: string;
    askText: string;
    content: string;
    images?: Image[];
    requisitesTitle: string;
    requisites?: Image[];
};

export type PageDelivery = {
    seo: ShortSEO | null;
    h1: string;
    mainImageLeft: Image;
    mainTextRight: string;
    images1: Image[];
    deliveryCitiesTitle: string;
    deliveryCitiesDescription: { label: string; value: string }[];
    courierTitle: string;
    courierDescription: { label: string; value: string }[];
    shipmentTitle: string;
    shipmentText: string;
    shipmentImageRight: Image;
    images2?: Image[];
};

export type PageGuarantee = {
    seo: ShortSEO | null;
    h1: string;
    mainLeftImage: Image;
    mainRightText: string;
    images1: Image[];
    guaranteeNotApplyTitle: string;
    guaranteeNotApplyText: string;
    images2: Image[];
    warningTitle: string;
    warningLeftImage: Image;
    warningRightText: string;
    content: string;
};

export type PageAbout = {
    seo: ShortSEO | null;
    h1: string;
    mainImageLeft: Image;
    mainTextRight: string;
    images1: Image[];
    whyNeedServicesTitle: string;
    whyNeedServicesText: string;
    images2: Image[];
    whyNeedServicesTextAfterImages2: string;
    mainPrinciplesTitle: string;
    mainPrinciplesTextLeft: string;
    mainPrinciplesImageRight: Image;
    images3: Image[];
    mainPrinciplesTextAfterImages3: string;
    nuancesTitle: string;
    nuancesText: string;
    images4: Image[];
    pricesTitle: string;
    pricesLeftImage: Image;
    pricesRightText: string;
    content: string;
};

export type PageProduct = {
    whyWeBest: LinkWithImage[];
};

export type PageProductTire = {
    textAfterDescription: string;
    textAfterBenefits: string;
    additionalDescription: string;
    seo: SEO;
};

export type PageProductCabin = {
    textAfterDescription: string;
    textAfterBenefits: string;
    additionalDescription: string;
    seo: SEO;
};

export type PageProductWheel = {
    textAfterDescription: string;
    textAfterBenefits: string;
    additionalDescription: string;
    seo: SEO;
};

export type PageProductSparePart = {
    textAfterDescription: string;
    autoSynonyms: string;
    textAfterBenefits: string;
    additionalDescription: string;
    seo: SEO;
};
