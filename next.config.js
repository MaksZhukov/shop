/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    publicRuntimeConfig: {
        backendUrl: process.env.BACKEND_URL
    }
};

module.exports = nextConfig;
