import { useEffect, useState } from 'react';

export const useHeaderScroll = () => {
	const [isScrolled, setIsScrolled] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			setIsScrolled(scrollTop > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return { isScrolled };
};
