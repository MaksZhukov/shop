import { AuthService } from './AuthService';
import { FavoritesService } from './FavoritesService';
import { SearchHistoryService } from './SearchHistoryService';
import { ViewedProductsService } from './ViewedProductsService';
import { ShoppingCartService } from './ShoppingCartService';

export const authService = new AuthService();
export const favoritesService = new FavoritesService();
export const shoppingCartService = new ShoppingCartService();
export const searchHistoryService = new SearchHistoryService();
export const viewedProductsService = new ViewedProductsService();
