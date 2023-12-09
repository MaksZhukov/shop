const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
	headers: async () => [
		{
			// list more extensions here if needed; these are all the resources in the `public` folder including the subfolders
			source: '/:all*(svg|jpg|png|webp)',
			locale: false,
			headers: [
				{
					key: 'Cache-Control',
					value: 'public, max-age=31536000, stale-while-revalidate'
				}
			]
		}
	],
	productionBrowserSourceMaps: true,
	reactStrictMode: false,
	...(process.env.PAGES ? { pageExtensions: ['dev.tsx'] } : {}),
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrl: process.env.BACKEND_LOCAL_URL,
		emailFEErrors: process.env.EMAIL_FE_ERRORS
	},
	images: {
		domains: process.env.IMAGES_DOMAINS.split(','),
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			}
		]
	},
	experimental: {
		largePageDataBytes: 200 * 1000,
		// IT NEEDS FOR DISABLING CACHE FOR EACH CLUSTER INDEPENDENTLY
		isrMemoryCacheSize: 0
	}
};

module.exports = withBundleAnalyzer(nextConfig);
