import { Favorite } from 'api/favorites/types';

export const saveJwt = (jwt: string) => {
	localStorage.setItem('token', jwt);
};

export const getJwt = (): string | null => {
	return localStorage.getItem('token');
};

export interface FavoriteLocalStorage {
	sparePart: number[];
	wheel: number[];
	tire: number[];
}

export const getFavoriteProductIDs = (): FavoriteLocalStorage => {
	let result = localStorage.getItem('favoriteProducts');
	return result ? JSON.parse(result) : { sparePart: [], wheel: [], tire: [] };
};

export const saveFavoriteProductID = (
	key: keyof FavoriteLocalStorage,
	id: number
) => {
	let favoriteProducts = getFavoriteProductIDs();
	favoriteProducts[key] = [...favoriteProducts[key], id];
	localStorage.setItem(
		'favoriteProductIDs',
		JSON.stringify(favoriteProducts)
	);
};

export const removeFavoriteProductID = (
	key: keyof FavoriteLocalStorage,
	id: number
) => {
	let favoriteProducts = getFavoriteProductIDs();
	favoriteProducts[key] = favoriteProducts[key].filter((item) => item !== id);
	localStorage.setItem(
		'favoriteProductIDs',
		JSON.stringify(favoriteProducts)
	);
};

export const getCartProductIDs = (): number[] => {
	let result = localStorage.getItem('cartProductIDs');
	return result ? JSON.parse(result) : [];
};

export const saveCartProductID = (id: number) => {
	let productIDs = getCartProductIDs();
	localStorage.setItem('cartProductIDs', JSON.stringify([...productIDs, id]));
};

export const removeCartProductID = (id: number) => {
	let productIDs = getCartProductIDs();
	localStorage.setItem(
		'cartProductIDs',
		JSON.stringify(productIDs.filter((productID) => productID !== id))
	);
};

export const saveIsReviewAdded = (value: boolean) => {
	localStorage.setItem('isReviewAdded', `${value}`);
};

export const getIsReviewAdded = (): boolean => {
	let result = localStorage.getItem('isReviewAdded');
	return result ? JSON.parse(result) : false;
};

export const saveReviewEmail = (email: string) => {
	localStorage.setItem('reviewEmail', email);
};

export const getReviewEmail = (): string => {
	return localStorage.getItem('reviewEmail') || '';
};
