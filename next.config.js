const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
	reactStrictMode: false,
	...(process.env.PAGES ? { pageExtensions: ['dev.tsx'] } : {}),
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrl: process.env.BACKEND_LOCAL_URL,
		rssLink: process.env.RSS_LINK,
		tawkPropertyId: process.env.TAWK_PROPERTY_ID,
		tawkId: process.env.TAWK_ID,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

module.exports = withBundleAnalyzer(nextConfig);
