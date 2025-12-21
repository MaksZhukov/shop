import slugify from 'slugify';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from './carConstants';

export const FUELS_SLUGIFY = FUELS.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_FUELS = Object.fromEntries(Object.entries(FUELS_SLUGIFY).map((a) => a.reverse()));

export const BODY_STYLES_SLUGIFY = BODY_STYLES.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_BODY_STYLES = Object.fromEntries(Object.entries(BODY_STYLES_SLUGIFY).map((a) => a.reverse()));

export const TRANSMISSIONS_SLUGIFY = TRANSMISSIONS.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_TRANSMISSIONS = Object.fromEntries(Object.entries(TRANSMISSIONS_SLUGIFY).map((a) => a.reverse()));
