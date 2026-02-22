/**
 * Opens BeGateway payment widget. Pure side-effect; callbacks are used for success/failure.
 */
export function openPaymentWidget(
	checkoutUrl: string,
	token: string,
	onSuccess: () => void | Promise<void>,
	onError: () => void | Promise<void>
): void {
	const closeWidget = async (status: string | null | undefined) => {
		if (status === 'successful') {
			await onSuccess();
		}
		if (status === 'error') {
			await onError();
		}
	};
	new BeGateway({
		checkout_url: checkoutUrl,
		token,
		closeWidget
	}).createWidget();
}
