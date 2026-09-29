import { useStrictContext } from 'shared/hooks';
import { ProfileContext } from './profile.context';

export const useDI = () => useStrictContext(ProfileContext);
