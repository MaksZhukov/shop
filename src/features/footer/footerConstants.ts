export const FOOTER_ADDRESS = 'Гродненская область, Гродненский район, с/с Коптевский, д. Полотково';

export const FOOTER_CONTACT = {
	phone: '+375297804780',
	phoneLabel: '+375 29 780 47 80',
	email: 'info@razbor-avto.by',
	workingHours: 'Ежедневно, с 8:00 до 18:00'
} as const;

export const FOOTER_INFO_LINKS = {
	columnA: [
		{ href: '/about', label: 'О компании' },
		{ href: '/payment', label: 'Оплата' },
		{ href: '/delivery', label: 'Доставка' },
		{ href: '/guarantee', label: 'Возврат' },
		{ href: '/reviews', label: 'Отзывы' }
	],
	columnB: [
		{ href: '/contacts', label: 'Вопрос-ответ' },
		{ href: '/articles', label: 'Новости' },
		{ href: '/contacts', label: 'Контакты' }
	],
	columnBAfterAuth: [{ href: '/articles', label: 'Все акции' }]
} as const;

export const FOOTER_CATALOG_LINKS = [
	{ href: '/spare-parts', label: 'Запчасти' },
	{ href: '/spare-parts/ksp-dvigatel', label: 'Двигатели' },
	{ href: '/spare-parts/ksp-kpp-avtomaticheskaya-akpp', label: 'Коробки передач' },
	{ href: '/tires', label: 'Шины и диски' },
	{ href: '/cabins', label: 'Салоны' }
] as const;

export const FOOTER_LEGAL_LINKS = [
	{ href: '/privacy', label: 'Политика конфиденциальности' },
	{ href: '/privacy', label: 'Обработка файлов cookie' },
	{ href: '/sitemap.xml', label: 'Карта сайта' }
] as const;

export const FOOTER_LEGAL_TEXT =
	'Свидетельство выдано Гродненским горисполкомом 03.11.2008. Регистрация в Торговом реестре 18.11.2022. Юр. адрес: 231710, Гродненская область, Гродненский район, с/с Коптевский, д. Полотково';

export const PAYMENT_METHODS = [
	{
		name: 'Visa',
		src: '/payment_visa.png',
		width: 81,
		height: 24
	},
	{
		name: 'Mastercard',
		src: '/payment_mastercard.png',
		width: 77,
		height: 24
	},
	{
		name: 'Belcard',
		src: '/payment_belcard.png',
		width: 63,
		height: 24
	},
	{
		name: 'Bepaid',
		src: '/payment_bepaid.png',
		width: 74,
		height: 24
	},
	{
		name: 'GPay',
		src: '/payment_gpay.png',
		width: 45,
		height: 24
	}
] as const;

export const MOBILE_BOTTOM_NAV_HEIGHT = 65;
