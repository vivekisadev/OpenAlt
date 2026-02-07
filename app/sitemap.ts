import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://openalt.org'; // Replace with your actual domain

    // Static routes
    const routes = [
        '',
        '/search',
        '/category',
        '/tag',
        '/blog',
        '/submit',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
