import { generateArrayOfYears } from 'services/DateService';

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
	'тягач',
] as const;

export const SEASONS = ['зимние', 'летние', 'всесезонные'] as const;

export const KIND_WHEELS = ['литой', 'штампованный'];

export const YEARS = generateArrayOfYears(30);
