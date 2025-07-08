import slugify from 'slugify';
import { BODY_STYLES, FUELS, KIND_WHEELS, SEASONS, TRANSMISSIONS } from './constants';

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

export const SEASONS_SLUGIFY = SEASONS.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_SEASONS = Object.fromEntries(Object.entries(SEASONS_SLUGIFY).map((a) => a.reverse()));

export const KIND_WHEELS_SLUGIFY = KIND_WHEELS.reduce(
	(prev, curr) => ({ ...prev, [curr]: slugify(curr) }),
	{} as { [key: string]: string }
);

export const SLUGIFY_KIND_WHEELS = Object.fromEntries(Object.entries(KIND_WHEELS_SLUGIFY).map((a) => a.reverse()));

export const COLORS = {
	Primary: '#17181C',
	Secondary: '#0C1555'
};
