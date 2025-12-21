import { Golos_Text } from 'next/font/google';

export const golos = Golos_Text({
	weight: ['400', '500', '700'],
	style: ['normal'],
	subsets: ['latin', 'cyrillic'],
	fallback: ['sans-serif']
});
