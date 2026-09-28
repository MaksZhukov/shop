import { useStrictContext } from 'shared/hooks';
import { VacanciesContext } from './vacancies.context';

export const useDI = () => useStrictContext(VacanciesContext);
