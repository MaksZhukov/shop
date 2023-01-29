const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
    reactStrictMode: false,
    ...(process.env.PAGES ? { pageExtensions: ['dev.tsx'] } : {}),
    publicRuntimeConfig: {
        backendUrl: process.env.BACKEND_URL,
        backendLocalUrl: process.env.BACKEND_LOCAL_URL
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
    rewrites: () => {
        return [
            {
                source: '/(spare-parts|wheels|cabins)/:brand',
                destination: '/spare-parts/:brand'
            },
            {
                source: '/(spare-parts|wheels|cabins)/:brand/:model(model-.*)',
                destination: '/spare-parts/:brand/:model'
            },
            {
                source: '/(spare-parts|wheels|cabins)/(.*)/:slug',
                destination: '/spare-parts/product'
            }
        ];
    }
};

module.exports = withBundleAnalyzer(nextConfig);
