import { backendLocalUrls } from 'services/EnvService';

export const getRandomBackendLocalUrl = () => {
	return backendLocalUrls[Math.floor(Math.random() * backendLocalUrls.length)];
};
