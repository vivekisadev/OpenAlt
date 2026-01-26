// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["raw.githubusercontent.com"],
    },
    // Allow any origin during development (adjust for production)
    allowedDevOrigins: ["*"],
    // Keep the default appDir and other settings
};
module.exports = nextConfig;
