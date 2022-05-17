import { enableStaticRendering, MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import CartStore from './Cart';
import NotificationStore from './Notification';
import UserStore from './User';

enableStaticRendering(typeof window === 'undefined');

class RootStore {
    user: UserStore;
    cart: CartStore;
    notification: NotificationStore;
    constructor() {
        this.user = new UserStore(this);
        this.cart = new CartStore(this);
        this.notification = new NotificationStore(this)
    }
}

export default RootStore;

export const store = new RootStore();

export function useStore() {
    return useContext(MobXProviderContext).store as RootStore;
}
