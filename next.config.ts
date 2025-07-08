import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig: NextConfig = {
	logging: {
		incomingRequests: true,
		fetches: {
			fullUrl: true,
			hmrRefreshes: true
		}
	},
	productionBrowserSourceMaps: true,
	reactStrictMode: true,
	...(process.env.PAGES ? { pageExtensions: ['dev.tsx'] } : {}),
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrls: JSON.parse(process.env.BACKEND_LOCAL_URLS || '[]'),
		emailFEErrors: process.env.EMAIL_FE_ERRORS
	},
	images: {
		remotePatterns: JSON.parse(process.env.REMOTE_PATTERNS || '[]'),
		minimumCacheTTL: 60000
	},
	experimental: {
		largePageDataBytes: 200 * 1000
	}
};

export default bundleAnalyzer(nextConfig);
