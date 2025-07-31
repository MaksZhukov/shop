import { SOCIAL_BUTTONS } from '../../../constants';

export const SOCIAL_BUTTONS_MOBILE = SOCIAL_BUTTONS.filter((item) =>
	['Telegram', 'WhatsApp', 'Viber'].includes(item.name)
);
