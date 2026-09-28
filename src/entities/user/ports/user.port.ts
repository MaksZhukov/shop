import type { UserApi } from '../user.api';

export type UserReader = Pick<UserApi, 'login' | 'logout' | 'register' | 'forgotPassword' | 'resetPassword' | 'getUserInfo' | 'updateUserInfo'>;
