/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    publicRuntimeConfig: {
        backendUrl: process.env.API_URL
    }
};

module.exports = nextConfig;
