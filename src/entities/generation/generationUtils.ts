import { SEO } from 'shared/api/types';

export const withGeneration = (seo: SEO, replace: string, generation?: string) => {
	if (generation) {
		const h1 = seo.h1.replace(replace, `${replace} ${generation}`);
		const title = seo.title.replace(replace, `${replace} ${generation}`);
		const description = seo.description.replace(replace, `${replace} ${generation}`);
		return { ...seo, title, description, h1 };
	}
	return seo;
};
