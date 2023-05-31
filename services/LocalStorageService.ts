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
