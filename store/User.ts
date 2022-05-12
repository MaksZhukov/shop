import { makeAutoObservable } from 'mobx';
import RootStore from '.';
import { getUserInfo, login } from '../api/user/user';
import { getJwt, saveJwt } from '../services/LocalStorageService';

export interface User {
    jwt: string;
    id: string;
    email: string;
}

export default class UserStore implements User {
    root: RootStore;

    jwt: string = '';
    id: string = '';
    email: string = '';

    constructor(root: RootStore) {
        this.root = root;
        makeAutoObservable(this);
    }
    async getInfo() {
        const { data } = await getUserInfo();
        this.jwt = data.jwt;
        this.id = data.id;
        this.email = data.email;
    }
    setJWT(jwt: string) {
        this.jwt = jwt;
    }
    async login(email: string, password: string) {
        const { data } = await login(email, password);
        this.jwt = data.jwt;
        this.id = data.user.id;
        this.email = data.user.email;
        saveJwt(data.jwt);
    }
    async logout() {
        this.jwt = '';
        this.id = '';
        this.email = '';
        saveJwt('');
    }
}
