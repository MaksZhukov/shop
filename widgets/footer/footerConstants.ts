export const NAVIGATION_LINKS = {
	products: [
		{ href: '/spare-parts', label: 'Запчасти' },
		{ href: '/spare-parts?kindSparePart=dvigatel', label: 'Двигатели' },
		{ href: '/cabins', label: 'Салоны' },
		{ href: '/tires', label: 'Шины' },
		{ href: '/wheels', label: 'Диски' }
	],
	company: [
		{ href: '/about', label: 'О нас' },
		{ href: '/news', label: 'Новости' },
		{ href: '/contacts', label: 'Контакты' },
		{ href: '/delivery-and-payment', label: 'Доставка и оплата' }
	],
	legal: [
		{ label: 'Политика персональных данных', href: '#' },
		{ label: 'Обработка файлов cookie', href: '#' }
	]
} as const;

export const CONTACT_INFO = {
	phones: [
		{ number: '+375297804780', label: '+375297804780' },
		{ number: '+375296011602', label: '+375296011602' }
	],
	email: 'email@razvor-auto.by',
	workingHours: ['Пн-Пт с 10:00 до 18:00', 'Сб-Вс с 10.00 до 14.00']
} as const;

export const COMPANY_INFO = {
	name: 'Авторазборка Полотково ООО "Дриблинг"',
	unp: 'УНП 590740644'
} as const;

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
