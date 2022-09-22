const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
	reactStrictMode: false,
	publicRuntimeConfig: {
		backendUrl: process.env.BACKEND_URL,
		backendLocalUrl: process.env.BACKEND_LOCAL_URL,
		rssLink: process.env.RSS_LINK,
	},
	images: {
		domains: process.env.IMAGES_DOMAINS.split(','),
	},
};

module.exports = withBundleAnalyzer(nextConfig);
