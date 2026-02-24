import type { SEO } from 'shared/api/types';

export const withKindSparePart = (seo: SEO, appendAfter: string, kindSparePart?: string): SEO => {
	if (kindSparePart) {
		const arrH1 = seo.h1.split(' ');
		const arrTitle = seo.title.split(' ');
		const arrDescription = seo.description.split(' ');
		arrH1.splice(1, 0, kindSparePart);
		arrTitle.splice(arrTitle.findIndex((item) => item.toLowerCase() === appendAfter) + 1, 0, kindSparePart);
		arrDescription.splice(
			arrDescription.findIndex((item) => item.toLowerCase() === appendAfter) + 1,
			0,
			kindSparePart
		);
		return {
			keywords: seo.keywords,
			title: arrTitle.join(' '),
			description: arrDescription.join(' '),
			h1: arrH1.join(' ')
		};
	}
	return { keywords: seo.keywords, title: seo.title, description: seo.description, h1: seo.h1 };
};
