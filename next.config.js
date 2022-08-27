/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrl: process.env.BACKEND_LOCAL_URL,
	},
};

module.exports = nextConfig;
