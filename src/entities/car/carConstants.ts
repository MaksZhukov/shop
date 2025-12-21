export const FUELS = ['бензин', 'дизель', 'гибрид', 'электро'] as const;

export const FUELS_OPTIONS = FUELS.map((item) => ({ label: item, value: item }));

export const TRANSMISSIONS = ['акпп', 'мкпп', 'робот', 'вариатор'] as const;

export const TRANSMISSIONS_OPTIONS = TRANSMISSIONS.map((item) => ({ label: item, value: item }));

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

export const BODY_STYLES_OPTIONS = BODY_STYLES.map((item) => ({ label: item, value: item }));
