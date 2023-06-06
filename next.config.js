const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
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
