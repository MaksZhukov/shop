import { BaseStorageService } from '../BaseStorageService';
import { ViewedProduct } from './types';

export class ViewedProductsService extends BaseStorageService {
	private readonly VIEWED_PRODUCTS_KEY = 'viewedProducts';
	private readonly LIMIT_VIEWED_PRODUCTS = 10;

	addViewedProduct(product: ViewedProduct): void {
		let viewedProducts = this.getViewedProducts();
		if (viewedProducts.find((item) => item.id === product.id)) {
			return;
		}
		const newViewedProducts = [product, ...viewedProducts].slice(0, this.LIMIT_VIEWED_PRODUCTS);
		this.saveViewedProducts(newViewedProducts);
	}

	saveViewedProducts(viewedProducts: ViewedProduct[]): void {
		this.setItem(this.VIEWED_PRODUCTS_KEY, viewedProducts);
	}

	getViewedProducts(): ViewedProduct[] {
		return this.getItem(this.VIEWED_PRODUCTS_KEY, []);
	}
}
