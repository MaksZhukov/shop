import { makeAutoObservable } from 'mobx';
import RootStore from '.';

export interface User {
    id: string;
}

export default class UserStore implements User {
    root: RootStore;

    id: string = 'id';
    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }
}
