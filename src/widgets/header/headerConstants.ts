export const MAX_SEARCH_HISTORY_LENGTH = 15;

export const HEADER_SEARCH_PLACEHOLDER_SHORT = 'Поиск...';

export { HEADER_HEIGHT } from 'shared/constants/headerLayout';

export const HEADER_CONTACT = {
	phone: '+375297804780',
	phoneLabel: '+375 29 780 47 80'
} as const;

export const HEADER_UTILITY_LINKS = [
	{ href: '/about', label: 'О компании' },
	{ href: '/payment', label: 'Оплата' },
	{ href: '/delivery', label: 'Доставка' },
	{ href: '/guarantee', label: 'Возврат' },
	{ href: '/reviews', label: 'Отзывы' },
	{ href: '/contacts', label: 'Вопрос-ответ' },
	{ href: '/articles', label: 'Новости' },
	{ href: '/contacts', label: 'Контакты' }
] as const;
