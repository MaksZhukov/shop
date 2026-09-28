import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ORDER_API, OrderApi } from './order.api';
import type { OrderReader } from './ports/order.port';
import type { ProductType } from 'entities/product';
import type { OrderCheckoutParams } from './model/order.model';

@injectable()
export class OrderService implements OrderReader {
	constructor(@inject(ORDER_API) private readonly orderApi: OrderApi) {}

	fetchOrderCheckout(products: { id: number; type: ProductType }[], paymentMethodType: string) {
		return this.orderApi.fetchOrderCheckout(products, paymentMethodType);
	}

	checkout(params: OrderCheckoutParams) {
		return this.orderApi.checkout(params);
	}

	reissueCheckoutToken(checkoutToken: string, orderId: number) {
		return this.orderApi.reissueCheckoutToken(checkoutToken, orderId);
	}

	cancelOrder(checkoutToken: string) {
		return this.orderApi.cancelOrder(checkoutToken);
	}

	cancelOrderBeacon(checkoutToken: string): void {
		return this.orderApi.cancelOrderBeacon(checkoutToken);
	}
}
