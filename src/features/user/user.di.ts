import { useStrictContext } from 'shared/hooks';
import { UserContext } from './user.context';

export const useDI = () => useStrictContext(UserContext);
