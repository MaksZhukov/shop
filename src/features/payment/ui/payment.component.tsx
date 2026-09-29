import { ReactMarkdown } from 'shared/ui';
import { PAYMENT_DEFAULT_TITLE } from '../payment.constants';
import { useDI } from '../payment.di';
import { PaymentHeader } from './paymentHeader.component';

export const PaymentEntry = () => {
	const { page } = useDI();

	return (
		<>
			<PaymentHeader title={page.seo?.h1 || PAYMENT_DEFAULT_TITLE} />
			<ReactMarkdown content={page.content} />
		</>
	);
};
