import type { OrderApi } from '../order.api';

export type OrderReader = Pick<OrderApi, 'fetchOrderCheckout' | 'checkout' | 'reissueCheckoutToken' | 'cancelOrder' | 'cancelOrderBeacon'>;
