import slugify from 'slugify';
import { SEASONS } from './tireConstants';

export const SEASONS_SLUGIFY = SEASONS.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_SEASONS = Object.fromEntries(Object.entries(SEASONS_SLUGIFY).map((a) => a.reverse()));
