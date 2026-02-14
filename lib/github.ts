// Helper to extract GitHub repo info from URL
export function extractGitHubRepo(githubUrl: string): { owner: string; repo: string } | null {
    if (!githubUrl) return null;

    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;

    return {
        owner: match[1],
        repo: match[2]
    };
}

// Fetch GitHub repo stats
export async function fetchGitHubStats(githubUrl: string): Promise<{
    stars: number;
    forks: number;
    issues: number;
    lastUpdated: string;
    lastPush: string;
    createdAt: string;
} | null> {
    const repoInfo = extractGitHubRepo(githubUrl);
    if (!repoInfo) return null;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                },
                cache: 'default', // Cache the response
            }
        );

        if (!response.ok) return null;

        const data = await response.json();

        return {
            stars: data.stargazers_count || 0,
            forks: data.forks_count || 0,
            issues: data.open_issues_count || 0,
            lastUpdated: data.updated_at || '',
            lastPush: data.pushed_at || '',
            createdAt: data.created_at || '',
        };
    } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
        return null;
    }
}

// Format number (e.g., 1234 -> 1.2k)
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Format date (e.g., "2024-11-20T08:45:00Z" -> "Nov 20, 2024")
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get relative time (e.g., "2 days ago")
export function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
