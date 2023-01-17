import { ProductType } from 'api/types';

export const saveJwt = (jwt: string) => {
	localStorage.setItem('token', jwt);
};

export const getJwt = (): string | null => {
	return localStorage.getItem('token');
};

interface ProductLocalStorage {
	id: number;
	type: ProductType;
	createdAt: number;
}

export const getFavoriteProducts = (): ProductLocalStorage[] => {
	let result = localStorage.getItem('favoriteProducts');
	return result ? JSON.parse(result) : [];
};

export const saveFavoriteProduct = (id: number, type: ProductType) => {
	let favoriteProducts = getFavoriteProducts();
	favoriteProducts.push({ id, type, createdAt: new Date().getTime() });
	localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
};

export const removeFavoriteProduct = (id: number, type: ProductType) => {
	let favoriteProducts = getFavoriteProducts();
	localStorage.setItem(
		'favoriteProducts',
		JSON.stringify(favoriteProducts.filter((item) => item.id !== id && item.type === type))
	);
};
