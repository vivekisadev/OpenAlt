
import { seedTools as originalTools } from "./tools-original";
import { toolsPart1 as aiTools } from "./tools-part1";
import { toolsBusiness } from "./tools-business";
import { toolsMarketing } from "./tools-marketing";
import { toolsCollab } from "./tools-collab";
import { toolsCreative } from "./tools-creative";
import { toolsDev } from "./tools-dev";
import { toolsUtils } from "./tools-utils";
import { knownLogos } from "./known-logos";


// Combine new tools arrays
const newTools = [
    ...aiTools,
    ...toolsBusiness,
    ...toolsMarketing,
    ...toolsCollab,
    ...toolsCreative,
    ...toolsDev,
    ...toolsUtils
];

// Helper to normalize names for comparison
const normalize = (val: string) => val.toLowerCase().replace(/[^a-z0-9]/g, "");

// Helper to generate logo URL from website URL
// Try the site's own favicon first, which is more reliable than Clearbit
const generateLogoUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        // Use the site's favicon.ico directly - most sites have this
        return `${urlObj.protocol}//${domain}/favicon.ico`;
    } catch {
        return "";
    }
};


// Map to store final tools
const finalToolsMap = new Map<string, any>();

// 1. Process original tools first (keep rich data)
originalTools.forEach((tool: any) => {
    const key = normalize(tool.name);
    finalToolsMap.set(key, { ...tool });
});

// 2. Process new tools (merge or add)
newTools.forEach((newTool: any) => {
    const key = normalize(newTool.name);

    if (finalToolsMap.has(key)) {
        // Merge logic: Update existing tool with new info if valuable
        const existing = finalToolsMap.get(key);

        // Update paidAlternative if missing in existing
        if (!existing.paidAlternative && newTool.paidAlternative) {
            existing.paidAlternative = newTool.paidAlternative;
        }

        // Update category if existing is generic? (Optional, maybe keep original)
        // Update tags if existing has fewer?
        if ((!existing.tags || existing.tags.length < 2) && newTool.tags) {
            existing.tags = [...new Set([...(existing.tags || []), ...newTool.tags])];
        }

        // Update features if existing lacks them
        if ((!existing.features || existing.features.length === 0) && newTool.features) {
            existing.features = newTool.features;
        }

        // Ensure approved status
        if (existing.approved === undefined) {
            existing.approved = true; // Default to true if merged?
        }

        // Update logo with known logo if available and current is favicon
        if (knownLogos[existing.name]) {
            existing.logo = knownLogos[existing.name];
        } else if (!existing.logo || existing.logo.includes('favicon.ico')) {
            // If no logo or using favicon, try to get a better one
            existing.logo = knownLogos[newTool.name] || newTool.logo || existing.logo;
        }

        finalToolsMap.set(key, existing);
    } else {
        // New tool - add it
        // Ensure all required fields for Prisma (e.g. approved default)
        const toolWithLogo = {
            ...newTool,
            // Priority: 1. Known logo, 2. Provided logo, 3. Generated favicon
            logo: knownLogos[newTool.name] || newTool.logo || generateLogoUrl(newTool.url),
            approved: true, // Auto-approve seeded tools
            longDescription: newTool.longDescription || newTool.description // Fallback
        };
        finalToolsMap.set(key, toolWithLogo);
    }
});

// Convert Map back to array
export const seedTools = Array.from(finalToolsMap.values());
