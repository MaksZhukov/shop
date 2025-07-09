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
		{ href: '/articles', label: 'Новости' },
		{ href: '/contacts', label: 'Контакты' },
		{ href: '/delivery', label: 'Доставка и оплата' }
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
