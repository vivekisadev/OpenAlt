import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://openalt.org'; // Replace with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // Disallow API and Admin routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
