export const NAVIGATION_LINKS = {
	products: [
		{ href: '/spare-parts', label: 'Запчасти' },
		{ href: '/spare-parts?kindSparePart=dvigatel', label: 'Двигатели' },
		{ href: '/cabins', label: 'Салоны' },
		{ href: '/tires', label: 'Шины' },
		{ href: '/wheels', label: 'Диски' }
	],
	company: [
		{ href: '/about', label: 'О Компании' },
		{ href: '/delivery', label: 'Доставка и оплата' },
		{ href: '/guarantees', label: 'Гарантии' },
		{
			href: 'https://www.google.com/maps/place/%D0%A0%D0%B0%D0%B7%D0%B1%D0%BE%D1%80%D0%BA%D0%B0+%D0%9F%D0%BE%D0%BB%D0%BE%D1%82%D0%BA%D0%BE%D0%B2%D0%BE.+%D0%9C%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%91%2F%D0%A3+%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%87%D0%B0%D1%81%D1%82%D0%B5%D0%B9./@53.5848483,23.8611084,17z/data=!4m8!3m7!1s0x46dfd990f4ab94dd:0xc75df7b81d42a898!8m2!3d53.5848483!4d23.8611084!9m1!1b1!16s%2Fg%2F11fy2tf60y?entry=ttu&g_ep=EgoyMDI1MDcwNy4wIKXMDSoASAFQAw%3D%3D',
			label: 'Отзывы',
			target: '_blank'
		},
		{ href: '/articles', label: 'Акции и новости' },
		{ href: '/contacts', label: 'Контакты' }
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
