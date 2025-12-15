import { SOCIAL_BUTTONS } from 'shared/ui';

export const SOCIAL_BUTTONS_MOBILE = SOCIAL_BUTTONS.filter((item) =>
	['Telegram', 'WhatsApp', 'Viber'].includes(item.name)
);

export const MAX_SEARCH_HISTORY_LENGTH = 15;

export const COMPANY_COORDINATES = {
	latitude: 53.584958,
	longitude: 23.861179
};

export const COMPANY_ADDRESS = 'Полотково, Гродненская область, Беларусь';
