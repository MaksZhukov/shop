const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
	productionBrowserSourceMaps: true,
	reactStrictMode: false,
	...(process.env.PAGES ? { pageExtensions: ['dev.tsx'] } : {}),
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrls: JSON.parse(process.env.BACKEND_LOCAL_URLS),
		emailFEErrors: process.env.EMAIL_FE_ERRORS
	},
	images: {
		remotePatterns: JSON.parse(process.env.REMOTE_PATTERNS),
		minimumCacheTTL: 60000
	},
	experimental: {
		largePageDataBytes: 200 * 1000
	}
};

module.exports = withBundleAnalyzer(nextConfig);
