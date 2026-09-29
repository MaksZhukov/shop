import { useQueryClient } from '@tanstack/react-query';
import { CartListService } from 'features/cart';
import { MobileContactsModal } from 'features/mobileContacts';
import {
	OrderRegistrationEntry,
	OrderRegistrationInjector,
	OrderRegistrationService,
	OrderRegistrationStore
} from 'features/orderRegistration';
import { createModuleInjector } from 'shared/di';
import { WorkTimetable } from 'shared/ui';
import { getPageProps } from 'shared/utils/pagePropsUtils';

export const inject = createModuleInjector([OrderRegistrationStore, OrderRegistrationService, CartListService]);

const OrderRegistrationPage = () => {
	const orderRegistrationStore = inject(OrderRegistrationStore);
	const orderRegistrationService = inject(OrderRegistrationService);
	const cartListService = inject(CartListService);
	const queryClient = useQueryClient();

	// Ordered products are sold now, so the cart drops them and cached product lists refetch.
	const onOrderPlaced = async (cartItemIds: number[]) => {
		await cartListService.removeMany(cartItemIds);
		await queryClient.invalidateQueries();
	};

	return (
		<OrderRegistrationInjector
			value={{
				orderRegistrationStore,
				orderRegistrationService,
				onOrderPlaced,
				cartLoad: cartListService.load,
				renderMobileContacts: (isOpened, onClose) => (
					<MobileContactsModal isOpened={isOpened} onClose={onClose} workTimetable={<WorkTimetable />} />
				)
			}}
		>
			<OrderRegistrationEntry />
		</OrderRegistrationInjector>
	);
};

export default OrderRegistrationPage;

export const getStaticProps = getPageProps(undefined, async () => ({
	props: {
		page: {
			seo: {
				title: 'Оформление заказа',
				description: 'Оформление заказа',
				keywords: 'Оформление заказа'
			}
		},
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Корзина', href: '/cart' },
			{ text: 'Оформление заказа', href: '/order-registration' }
		]
	}
}));
