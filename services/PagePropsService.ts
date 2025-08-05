import { fetchLayout } from 'api/layout/layout';
import { ApiResponse } from 'api/types';
import { AxiosError, AxiosResponse } from 'axios';
import { UAParser } from 'ua-parser-js';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DefaultPage } from 'api/pages/types';

type DeviceType = 'desktop' | 'mobile';

const getDeviceType = (userAgent?: string): DeviceType => {
	if (!userAgent) return 'desktop';

	const parser = new UAParser(userAgent);
	const deviceType = parser.getDevice().type;

	return deviceType === 'mobile' || deviceType === 'tablet' ? 'mobile' : 'desktop';
};

const handleErrorRedirect = (status: number): GetServerSidePropsResult<Record<string, object>> | null => {
	switch (status) {
		case 404:
			return { redirect: { destination: '/404', permanent: false } };
		case 500:
			return { redirect: { destination: '/500', permanent: false } };
		case 301:
		case 302:
			return { redirect: { destination: '/', permanent: status === 301 } };
		default:
			return null;
	}
};

export const getPageProps = (
	fetchPage?: () => Promise<AxiosResponse<ApiResponse<DefaultPage>>>,
	fetchAdditional?: (
		context: GetServerSidePropsContext,
		deviceType: DeviceType
	) => Promise<GetServerSidePropsResult<Record<string, object | number | string>>>
) => {
	return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Record<string, object>>> => {
		const deviceType = getDeviceType(context?.req?.headers['user-agent']);

		let result: any = { props: {} };

		try {
			const fetchFunctions = [
				fetchLayout(),
				fetchPage ? fetchPage() : Promise.resolve({ props: {} }),
				...(fetchAdditional ? [fetchAdditional(context, deviceType)] : [])
			];

			const responses = await Promise.all(fetchFunctions);
			const [layoutResponse, pageResponse, additionalResponse] = responses;

			if (additionalResponse) {
				result = additionalResponse;
			}

			if (fetchPage && pageResponse && 'data' in pageResponse && pageResponse.data.data) {
				result.props.page = pageResponse.data.data;
			}

			if (layoutResponse && 'data' in layoutResponse && layoutResponse.data.data) {
				result.props.layout = layoutResponse.data.data;
			}

			return result;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status) {
				const redirect = handleErrorRedirect(error.response.status);
				if (redirect) {
					return redirect;
				}
			}

			return { redirect: { destination: '/500', permanent: false } };
		}
	};
};
