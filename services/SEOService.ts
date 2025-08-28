import { SEO } from 'api/types';

export const withKindSparePart = (seo: SEO, appendAfter: string, kindSparePart?: string) => {
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
		return { ...seo, title: arrTitle.join(' '), description: arrDescription.join(' '), h1: arrH1.join(' ') };
	}
	return seo;
};

export const withGeneration = (seo: SEO, replace: string, generation?: string) => {
	if (generation) {
		const h1 = seo.h1.replace(replace, `${replace} ${generation}`);
		const title = seo.title.replace(replace, `${replace} ${generation}`);
		const description = seo.description.replace(replace, `${replace} ${generation}`);
		return { ...seo, title, description, h1 };
	}
	return seo;
};
