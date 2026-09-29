import { useStrictContext } from 'shared/hooks';
import { MainPageContext } from './mainPage.context';

export const useDI = () => useStrictContext(MainPageContext);
