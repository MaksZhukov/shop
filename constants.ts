import { generateArrayOfYears } from 'services/DateService';
import { WorkingHour } from './types';
import { InstagramIcon, TelegramIcon, WhatsAppIcon, SkypeIcon, ViberIcon } from 'components/icons';

export const PRIVATE_PATHS = ['/profile'];
export const OFFSET_SCROLL_LOAD_MORE = 100;
export const FUELS = ['бензин', 'дизель', 'гибрид', 'электро'] as const;

export const TRANSMISSIONS = ['акпп', 'мкпп', 'робот', 'вариатор'] as const;
export const BODY_STYLES = [
	'седан',
	'хэтчбек',
	'универсал',
	'внедорожник',
	'минивэн',
	'купе',
	'лифтбек',
	'пикап',
	'кабриолет',
	'фургон',
	'бортовой',
	'тягач'
] as const;

export const SEASONS = ['зимние', 'летние', 'всесезонные'] as const;

export const KIND_WHEELS = ['литой', 'штампованный'];

export const YEARS = generateArrayOfYears(30);

export const WORKING_HOURS: WorkingHour[] = [
	{ day: 'Понедельник', hours: '10:00 - 18:00', dayIndex: 1 },
	{ day: 'Вторник', hours: '10:00 - 18:00', dayIndex: 2 },
	{ day: 'Среда', hours: '10:00 - 18:00', dayIndex: 3 },
	{ day: 'Четверг', hours: '10:00 - 18:00', dayIndex: 4 },
	{ day: 'Пятница', hours: '10:00 - 18:00', dayIndex: 5 },
	{ day: 'Суббота', hours: '10:00 - 14:00', dayIndex: 6 },
	{ day: 'Воскресенье', hours: '10:00 - 14:00', dayIndex: 0 }
];

export const SOCIAL_BUTTONS = [
	{ Component: TelegramIcon, name: 'Telegram', href: 'https://t.me/+375297804780' },
	{ Component: WhatsAppIcon, name: 'WhatsApp', href: 'https://wa.me/375297804780' },
	{ Component: ViberIcon, name: 'Viber', href: 'viber://chat?number=375297804780' },
	{ Component: SkypeIcon, name: 'Skype', href: 'skype:+375297804780?call' },
	{
		Component: InstagramIcon,
		name: 'Instagram',
		href: 'https://instagram.com/razbor_auto'
	}
] as const;

export const COMPANY_COORDINATES = {
	latitude: 53.584958,
	longitude: 23.861179
};

export const COMPANY_ADDRESS = 'Полотково, Гродненская область, Беларусь';
