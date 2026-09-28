import { useStrictContext } from 'shared/hooks';
import { ReviewsContext } from './reviews.context';

export const useDI = () => useStrictContext(ReviewsContext);
