import slugify from 'slugify';
import { KIND_WHEELS } from './wheelConstants';

export const KIND_WHEELS_SLUGIFY = KIND_WHEELS.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_KIND_WHEELS = Object.fromEntries(Object.entries(KIND_WHEELS_SLUGIFY).map((a) => a.reverse()));
