/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        backendUrl: process.env.API_URL,
    },
};

module.exports = nextConfig;
