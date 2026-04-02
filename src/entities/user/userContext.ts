import { createContext } from 'react';
import { UserStore } from './userStore';

export const UserStoreContext = createContext<UserStore | null>(null);
