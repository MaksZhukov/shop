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
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*' // or use "**"
			}
		],
		minimumCacheTTL: 60000,
		qualities: [50, 60, 70, 80, 90, 100]
	},
	experimental: {
		largePageDataBytes: 200 * 1000
	}
};

export default bundleAnalyzer(nextConfig);
