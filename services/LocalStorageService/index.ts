import { AuthService } from './AuthService';
import { FavoritesService } from './FavoritesService';
import { SearchHistoryService } from './SearchHistoryService';
import { ViewedProductsService } from './ViewedProductsService';

export const authService = new AuthService();
export const favoritesService = new FavoritesService();
export const searchHistoryService = new SearchHistoryService();
export const viewedProductsService = new ViewedProductsService();
