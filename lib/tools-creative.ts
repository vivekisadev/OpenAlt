
// Category: Design, Media, Content & Publishing

export const toolsCreative = [
    // --- Content & Publishing ---
    {
        name: "Ghost",
        category: "Writing",
        description: "The professional publishing platform.",
        url: "https://ghost.org",
        githubUrl: "https://github.com/TryGhost/Ghost",
        tags: ["Publishing", "CMS", "Blog"],
        paidAlternative: "Medium / Substack",
        features: ["Newsletters", "Memberships", "SEO"]
    },
    {
        name: "Strapi",
        category: "Web Dev",
        description: "The leading open-source Headless CMS.",
        url: "https://strapi.io",
        githubUrl: "https://github.com/strapi/strapi",
        tags: ["CMS", "Headless", "JavaScript"],
        paidAlternative: "Contentful",
        features: ["Customizable API", "Plugins", "Role-based Access"]
    },
    {
        name: "Directus",
        category: "Database",
        description: "Open Data Platform for any SQL database.",
        url: "https://directus.io",
        githubUrl: "https://github.com/directus/directus",
        tags: ["CMS", "Database", "Headless"],
        paidAlternative: "Contentful / Backendless",
        features: ["No-Code App", "API Generation", "Asset Management"]
    },
    {
        name: "Payload CMS",
        category: "Web Dev",
        description: "The best way to build a modern backend and admin UI.",
        url: "https://payloadcms.com",
        githubUrl: "https://github.com/payloadcms/payload",
        tags: ["CMS", "Headless", "TypeScript"],
        paidAlternative: "Sanity",
        features: ["Code-first", "React Admin", "Extensible"]
    },
    {
        name: "Decap CMS",
        category: "Web Dev",
        description: "Open source content management for your Git workflow.",
        url: "https://decapcms.org",
        githubUrl: "https://github.com/decaporg/decap-cms",
        tags: ["CMS", "Git", "Static Sites"],
        paidAlternative: "Forestry (defunct)",
        features: ["Git-based", "React UI", "Extensible"]
    },
    // --- Design & Media ---
    {
        name: "Blender",
        category: "3D Modeling",
        description: "Free and open source 3D creation suite.",
        url: "https://www.blender.org",
        githubUrl: "https://github.com/blender/blender",
        tags: ["3D", "Animation", "VFX"],
        paidAlternative: "Maya / Cinema 4D",
        features: ["Modeling", "Sculpting", "Animation", "Rendering"]
    },
    {
        name: "GIMP",
        category: "Design",
        description: "GNU Image Manipulation Program.",
        url: "https://www.gimp.org",
        githubUrl: "https://github.com/GNOME/gimp",
        tags: ["Design", "Image Editor", "Graphics"],
        paidAlternative: "Adobe Photoshop",
        features: ["Photo Retouching", "Image Composition", "Authoring"]
    },
    {
        name: "Inkscape",
        category: "Design",
        description: "Professional Vector Graphics Editor.",
        url: "https://inkscape.org",
        githubUrl: "https://gitlab.com/inkscape/inkscape",
        tags: ["Design", "Vector", "Illustration"],
        paidAlternative: "Adobe Illustrator",
        features: ["Vector Editing", "Node Editing", "SVG Support"]
    },
    {
        name: "Krita",
        category: "Design",
        description: "Digital painting and animation software.",
        url: "https://krita.org",
        githubUrl: "https://invent.kde.org/graphics/krita",
        tags: ["Design", "Painting", "Art"],
        paidAlternative: "Corel Painter / Procreate",
        features: ["Brush Engines", "Stabilizers", "Animation"]
    },
    {
        name: "Darktable",
        category: "Design",
        description: "Open source photography workflow application.",
        url: "https://www.darktable.org",
        githubUrl: "https://github.com/darktable-org/darktable",
        tags: ["Photography", "RAW Editor", "Design"],
        paidAlternative: "Adobe Lightroom",
        features: ["RAW Developing", "Asset Management", "Non-destructive"]
    },
    {
        name: "Audacity",
        category: "Audio & Speech",
        description: "Free, open source, cross-platform audio software.",
        url: "https://www.audacityteam.org",
        githubUrl: "https://github.com/audacity/audacity",
        tags: ["Audio", "Editing", "Recording"],
        paidAlternative: "Adobe Audition",
        features: ["Multi-track Editing", "Effects", "Recording"]
    },
    {
        name: "OBS Studio",
        category: "Video Creation",
        description: "Free and open source software for video recording and live streaming.",
        url: "https://obsproject.com",
        githubUrl: "https://github.com/obsproject/obs-studio",
        tags: ["Video", "Streaming", "Recording"],
        paidAlternative: "XSplit / Wirecast",
        features: ["Live Streaming", "Scene Composition", "Audio Mixing"]
    },
    {
        name: "Shotcut",
        category: "Video Creation",
        description: "Free, open source, cross-platform video editor.",
        url: "https://shotcut.org",
        githubUrl: "https://github.com/mltframework/shotcut",
        tags: ["Video", "Editing", "Production"],
        paidAlternative: "Adobe Premiere Elements",
        features: ["4K Support", "Timeline Editing", "filters"]
    },
    {
        name: "Kdenlive",
        category: "Video Creation",
        description: "Free and open source video editor.",
        url: "https://kdenlive.org",
        githubUrl: "https://invent.kde.org/multimedia/kdenlive",
        tags: ["Video", "Editing", "KDE"],
        paidAlternative: "Adobe Premiere Pro",
        features: ["Multi-track", "proxy editing", "Effects"]
    },
    {
        name: "LosslessCut",
        category: "Video Creation",
        description: "The swiss army knife of lossless video/audio editing.",
        url: "https://mifi.no/losslesscut/",
        githubUrl: "https://github.com/mifi/lossless-cut",
        tags: ["Video", "Utility", "Editing"],
        paidAlternative: "Avidemux (also free)",
        features: ["Lossless Trimming", "Concatenation", "No Re-encoding"]
    },
    {
        name: "PeerTube",
        category: "Video Creation",
        description: "Decentralized video hosting network.",
        url: "https://joinpeertube.org",
        githubUrl: "https://github.com/Chocobozzz/PeerTube",
        tags: ["Video", "Streaming", "Federation"],
        paidAlternative: "YouTube / Vimeo",
        features: ["P2P Streaming", "Federation", "Ad-free"]
    },
    // --- Digital Asset Management (DAM) ---
    {
        name: "Immich",
        category: "Design",
        description: "Self-hosted photo and video backup solution.",
        url: "https://immich.app",
        githubUrl: "https://github.com/immich-app/immich",
        tags: ["Photos", "Backup", "Self-hosted"],
        paidAlternative: "Google Photos",
        features: ["Mobile App", "Auto Backup", "Face Recognition"]
    },
    {
        name: "PhotoPrism",
        category: "Design",
        description: "AI-powered Photos App for the Decentralized Web.",
        url: "https://photoprism.app",
        githubUrl: "https://github.com/photoprism/photoprism",
        tags: ["Photos", "AI", "Gallery"],
        paidAlternative: "Google Photos",
        features: ["AI Categorization", "Metadata", "Maps"]
    }
];
