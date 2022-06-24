export const saveJwt = (jwt: string) => {
	localStorage.setItem('token', jwt);
};

export const getJwt = (): string | null => {
	return localStorage.getItem('token');
};

export const getFavoriteProductIDs = (): number[] => {
	let result = localStorage.getItem('favoriteProductIDs');
	return result ? JSON.parse(result) : [];
};

export const saveFavoriteProductID = (id: number) => {
	let productIDs = getFavoriteProductIDs();
	localStorage.setItem(
		'favoriteProductIDs',
		JSON.stringify([...productIDs, id])
	);
};

export const removeFavoriteProductID = (id: number) => {
	let productIDs = getFavoriteProductIDs();
	localStorage.setItem(
		'favoriteProductIDs',
		JSON.stringify(productIDs.filter((productID) => productID !== id))
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
