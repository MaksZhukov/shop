const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
	productionBrowserSourceMaps: true,
	reactStrictMode: false,
	...(process.env.PAGES ? { pageExtensions: ['dev.tsx'] } : {}),
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrl: process.env.BACKEND_LOCAL_URL,
		emailFEErrors: process.env.EMAIL_FE_ERRORS
	},
	images: {
		remotePatterns: process.env.IMAGES_DOMAINS.split(',').map((item) => ({
			protocol: 'https',
			hostname: item,
			pathname: '/**'
		})),
		minimumCacheTTL: 60000
	},
	// IT NEEDS FOR DISABLING CACHE FOR EACH CLUSTER INDEPENDENTLY
	cacheMaxMemorySize: 0,
	experimental: {
		largePageDataBytes: 200 * 1000
	}
};

module.exports = withBundleAnalyzer(nextConfig);
