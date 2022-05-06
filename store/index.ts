import { IKeyValueMap } from 'mobx';
import { MobXProviderContext, useStaticRendering } from 'mobx-react';
import { useContext } from 'react';
import UserStore from './User';

class RootStore {
    user: UserStore;
    constructor() {
        this.user = new UserStore(this);
    }
}

export default RootStore;

export function useStores() {
    return useContext(MobXProviderContext) as RootStore;
}
