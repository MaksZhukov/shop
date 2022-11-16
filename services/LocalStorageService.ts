import { Favorite } from 'api/favorites/types';
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
		JSON.stringify(
			favoriteProducts.filter(
				(item) => item.id !== id && item.type === type
			)
		)
	);
};

// export const getCartProducts = (): ProductLocalStorage[] => {
// 	let result = localStorage.getItem('cartProducts');
// 	return result ? JSON.parse(result) : [];
// };

// export const saveCartProduct = (id: number, type: ProductType) => {
// 	let cartProducts = getCartProducts();
// 	cartProducts.push({ id, type, createdAt: new Date().getTime() });
// 	localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
// };

// export const removeCartProduct = (id: number, type: ProductType) => {
// 	let cartProducts = getCartProducts();
// 	localStorage.setItem(
// 		'cartProducts',
// 		JSON.stringify(
// 			cartProducts.filter((item) => item.id !== id && item.type === type)
// 		)
// 	);
// };

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
