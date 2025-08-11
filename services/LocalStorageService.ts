import { Favorite } from 'api/favorites/types';
import { ProductType } from 'api/types';

export type StorageFavorite = Omit<Favorite, 'product'> & { product: { id: number; type: ProductType } };

export const saveJwt = (jwt: string) => {
	localStorage.setItem('token', jwt);
};

export const getJwt = (): string | null => {
	return localStorage.getItem('token');
};

export const getFavorites = (): StorageFavorite[] => {
	let result = localStorage.getItem('favoriteProducts');
	return result ? JSON.parse(result) : [];
};

export const saveFavorite = (favorite: Favorite) => {
	let favorites = getFavorites();
	favorites.push({ ...favorite, product: { id: favorite.product.id, type: favorite.product.type } });
	localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
};

export const removeFavorite = (favorite: Favorite) => {
	let favorites = getFavorites();
	localStorage.setItem('favoriteProducts', JSON.stringify(favorites.filter((item) => item.id !== favorite.id)));
};

export const removeFavorites = (favoritesIDs: number[]) => {
	let favoritesLS = getFavorites();
	localStorage.setItem(
		'favoriteProducts',
		JSON.stringify(favoritesLS.filter((item) => !favoritesIDs.includes(item.id)))
	);
};

export const getSearchHistory = (): string[] => {
	if (typeof window === 'undefined' || !window.localStorage) {
		return [];
	}

	let result = localStorage.getItem('searchHistory');
	return result ? JSON.parse(result) : [];
};

export const saveSearchHistory = (searchHistory: string[]) => {
	localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

type ViewedProduct = {
	id: number;
	type: ProductType;
};

const LIMIT_VIEWED_PRODUCTS = 10;

export const addViewedProduct = (product: ViewedProduct) => {
	let viewedProducts = getViewedProducts();
	if (viewedProducts.find((item) => item.id === product.id)) {
		return;
	}
	const newViewedProducts = [product, ...viewedProducts].slice(0, LIMIT_VIEWED_PRODUCTS);
	saveViewedProducts(newViewedProducts);
};

export const saveViewedProducts = (viewedProducts: ViewedProduct[]) => {
	localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
};

export const getViewedProducts = (): ViewedProduct[] => {
	if (typeof window === 'undefined' || !window.localStorage) {
		return [];
	}
	let result = localStorage.getItem('viewedProducts');
	return result ? JSON.parse(result) : [];
};
