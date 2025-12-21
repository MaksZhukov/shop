import { backendLocalUrls } from 'shared/services/EnvService';

export const getRandomBackendLocalUrl = () => {
	return backendLocalUrls[Math.floor(Math.random() * backendLocalUrls.length)];
};
