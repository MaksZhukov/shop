/** @type {import('next').NextConfig} */
console.log(process.env.BACKEND_URL);
const nextConfig = {
    reactStrictMode: false,
    publicRuntimeConfig: {
        backendUrl: process.env.BACKEND_URL,
    },
};

module.exports = nextConfig;
