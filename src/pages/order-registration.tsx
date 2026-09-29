import { CartStore } from 'entities/cart';
import { OrderService } from 'entities/order';
import { UserStore } from 'entities/user';
import { useRemoveCartMany } from 'features/cart';
import { MobileContactsModal } from 'features/mobileContacts';
import { OrderRegistrationEntry, OrderRegistrationInjector, OrderRegistrationStore } from 'features/orderRegistration';
import { createModuleInjector } from 'shared/di';
import { WorkTimetable } from 'shared/ui';
import { getPageProps } from 'shared/utils/pagePropsUtils';

export const inject = createModuleInjector([OrderService, OrderRegistrationStore, UserStore, CartStore]);

const OrderRegistrationPage = () => {
	const orderService = inject(OrderService);
	const orderRegistrationStore = inject(OrderRegistrationStore);
	const userStore = inject(UserStore);
	const cartStore = inject(CartStore);
	const removeCartMany = useRemoveCartMany();

	return (
		<OrderRegistrationInjector
			value={{
				orderService,
				orderRegistrationStore,
				userStore,
				cartStore,
				removeCartMany,
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
