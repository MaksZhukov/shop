import { SEO } from 'api/types';

export const withKindSparePart = (seo: SEO, kindSparePart?: string) => {
    if (kindSparePart) {
        const arr = seo.h1.split(' ');
        arr.splice(1, 0, kindSparePart);
        return { ...seo, h1: arr.join(' ') };
    }
    return seo;
};
