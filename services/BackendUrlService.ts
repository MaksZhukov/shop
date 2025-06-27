import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const getRandomBackendLocalUrl = () => {
	const backendUrls = publicRuntimeConfig.backendLocalUrls;
	if (Array.isArray(backendUrls)) {
		return backendUrls[Math.floor(Math.random() * backendUrls.length)];
	}
	return backendUrls;
};
