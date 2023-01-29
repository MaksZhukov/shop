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
                source: '/:productsSlug(spare-parts|wheels|cabins)/:brand',
                destination: '/:productsSlug/:brand'
            },
            {
                source: '/:productsSlug(spare-parts|wheels|cabins)/:brand/:model(model-.*)',
                destination: '/:productsSlug/:brand/:model'
            },
            {
                source: '/:productsSlug(spare-parts|wheels|cabins)/(.*)/:slug',
                destination: '/:productsSlug/product'
            }
        ];
    }
};

module.exports = withBundleAnalyzer(nextConfig);
