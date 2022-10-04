import { checkReviewStatus } from "api/reviews/reviews";
import { makeAutoObservable, action, runInAction } from "mobx";
import RootStore from ".";
import { getUserInfo, login, updateUserInfo } from "../api/user/user";
import { getReviewEmail, saveJwt } from "../services/LocalStorageService";

export interface User {
  jwt: string;
  id: string;
  email: string;
}

export type ReviewStatus = "" | "draft" | "published";

export default class UserStore implements User {
  root: RootStore;

  jwt: string = "";
  id: string = "";
  email: string = "";
  username: string = "";
  phone: string = "";
  address: string = "";
  reviewStatus: ReviewStatus = "";

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  async loadInfo() {
    const { data } = await getUserInfo();
    runInAction(() => {
      this.id = data.id;
      this.email = data.email;
      this.username = data.username;
      this.phone = data.phone || "";
      this.address = data.address || "";
    });
    await this.loadReviewStatus(data.email);
  }
  async loadReviewStatus(email: string) {
    const {
      data: {
        data: { status },
      },
    } = await checkReviewStatus(email);
    runInAction(() => {
      this.reviewStatus = status;
    });
  }
  setJWT(jwt: string) {
    this.jwt = jwt;
  }
  async login(email: string, password: string) {
    const { data } = await login(email, password);
    runInAction(() => {
      this.jwt = data.jwt;
      this.id = data.user.id;
      this.email = data.user.email;
      this.username = data.user.username;
      this.phone = data.user.phone;
      this.address = data.user.address;
    });
    saveJwt(data.jwt);
    await this.loadReviewStatus(data.user.email);
  }
  clearUser() {
    this.jwt = "";
    this.id = "";
    this.email = "";
    this.phone = "";
    this.address = "";
    this.reviewStatus = "";
  }
  async logout() {
    this.clearUser();
    this.root.cart.clearShoppingCart();
    this.root.favorites.clearFavorites();
    saveJwt("");
    this.root.cart.loadShoppingCart();
    this.root.favorites.loadFavorites();
    const email = getReviewEmail();
    if (email) {
      await this.loadReviewStatus(email);
    }
  }

  setUsername(username: string) {
    this.username = username;
  }
  setPhone(phone: string) {
    this.phone = phone;
  }
  setAddress(address: string) {
    this.address = address;
  }
  setReviewStatus(status: ReviewStatus) {
    this.reviewStatus = status;
  }

  async saveUserInfo() {
    await updateUserInfo({
      phone: this.phone,
      address: this.address,
      username: this.username,
    });
  }
}
