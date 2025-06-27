import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const getRandomBackendLocalUrl = () => {
	const backendUrls = publicRuntimeConfig.backendLocalUrls;
	return backendUrls[Math.floor(Math.random() * backendUrls.length)];
};
