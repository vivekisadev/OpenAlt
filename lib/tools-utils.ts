
// Category: Utilities, Privacy, Browsers

export const toolsUtils = [
    // --- Browsers ---
    {
        name: "Brave",
        category: "Web Dev", // Or Utility?
        description: "Privacy-focused browser.",
        url: "https://brave.com",
        githubUrl: "https://github.com/brave/brave-browser",
        tags: ["Browser", "Privacy", "Security"],
        paidAlternative: "Chrome",
        features: ["Ad Blocker", "Rewards", "Tor Integration"]
    },
    {
        name: "Firefox",
        category: "Web Dev",
        description: "Fast, private and free open source browser.",
        url: "https://www.mozilla.org/firefox",
        githubUrl: "https://github.com/mozilla/gecko-dev",
        tags: ["Browser", "Privacy", "Standard"],
        paidAlternative: "Chrome",
        features: ["Extensions", "Privacy Protection", "Sync"]
    },
    {
        name: "LibreWolf",
        category: "Security",
        description: "A fork of Firefox, focused on privacy, security and freedom.",
        url: "https://librewolf.net",
        githubUrl: "https://gitlab.com/librewolf-community/browser",
        tags: ["Browser", "Privacy", "Hardened"],
        paidAlternative: "Chrome",
        features: ["No Telemetry", "uBlock Origin", "Privacy Settings"]
    },
    {
        name: "Tor Browser",
        category: "Security",
        description: "Protect your privacy and defend yourself against network surveillance.",
        url: "https://www.torproject.org",
        githubUrl: "https://gitlab.torproject.org/tpo/applications/tor-browser",
        tags: ["Browser", "Anonymity", "Privacy"],
        paidAlternative: "VPN",
        features: ["Onion Routing", "Anti-fingerprinting", "Encryption"]
    },
    // --- VPN & Networking ---
    {
        name: "WireGuard",
        category: "Security",
        description: "Fast, modern, secure VPN tunnel.",
        url: "https://www.wireguard.com",
        githubUrl: "https://github.com/WireGuard/wireguard-monolithic-historical",
        tags: ["VPN", "Networking", "Protocol"],
        paidAlternative: "NordVPN (Service)",
        features: ["High Performance", "Simple Config", "Modern Crypto"]
    },
    {
        name: "OpenVPN",
        category: "Security",
        description: "Full-featured open source SSL VPN solution.",
        url: "https://openvpn.net",
        githubUrl: "https://github.com/OpenVPN/openvpn",
        tags: ["VPN", "Enterprise", "Legacy"],
        paidAlternative: "Cisco AnyConnect",
        features: ["Standard", "Tunneling", "Cross-platform"]
    },
    {
        name: "Tailscale",
        category: "DevOps",
        description: "Zero config VPN for building secure networks.",
        url: "https://tailscale.com",
        githubUrl: "https://github.com/tailscale/tailscale", // Client is open
        tags: ["VPN", "Mesh", "Networking"],
        paidAlternative: "Traditional VPNs",
        features: ["Mesh Network", "ACLs", "SSO"]
    },
    {
        name: "Headscale",
        category: "DevOps",
        description: "Open Source Tailscale Control Server.",
        url: "https://github.com/juanfont/headscale",
        githubUrl: "https://github.com/juanfont/headscale",
        tags: ["VPN", "Self-hosted", "Networking"],
        paidAlternative: "Tailscale (SaaS)",
        features: ["Top Control", "Self-hosted", "No Limits"]
    },
    // --- Utilities ---
    {
        name: "KeePassXC",
        category: "Security",
        description: "Cross-Platform Password Manager.",
        url: "https://keepassxc.org",
        githubUrl: "https://github.com/keepassxreboot/keepassxc",
        tags: ["Passwords", "Local", "Security"],
        paidAlternative: "1Password",
        features: ["Local Database", "Auto-Type", "Encryption"]
    },
    {
        name: "Syncthing",
        category: "Productivity",
        description: "Open Source Continuous File Synchronization.",
        url: "https://syncthing.net",
        githubUrl: "https://github.com/syncthing/syncthing",
        tags: ["Sync", "P2P", "Files"],
        paidAlternative: "Dropbox",
        features: ["Decentralized", "Encrypted", "Private"]
    },
    {
        name: "Rclone",
        category: "DevOps",
        description: "Rsync for cloud storage.",
        url: "https://rclone.org",
        githubUrl: "https://github.com/rclone/rclone",
        logo: "/logos/rclone.png",
        tags: ["Backup", "CLI", "Storage"],
        paidAlternative: "Box / Drive Clients",
        features: ["50+ Providers", "Sync", "Encryption"]
    },
    {
        name: "Cryptomator",
        category: "Security",
        description: "Client-side encryption for cloud storage.",
        url: "https://cryptomator.org",
        githubUrl: "https://github.com/cryptomator/cryptomator",
        tags: ["Encryption", "Cloud", "Privacy"],
        paidAlternative: "Boxcryptor",
        features: ["Transparent Encryption", "Vaults", "Cross-platform"]
    },
    {
        name: "VLC",
        category: "Video Creation",
        description: "The best open source media player.",
        url: "https://www.videolan.org/vlc/",
        githubUrl: "https://github.com/videolan/vlc",
        tags: ["Player", "Media", "Video"],
        paidAlternative: "PowerDVD",
        features: ["Plays Anything", "Streaming", "Converter"]
    },
    {
        name: "HandBrake",
        category: "Video Creation",
        description: "Open Source Video Transcoder.",
        url: "https://handbrake.fr",
        githubUrl: "https://github.com/HandBrake/HandBrake",
        tags: ["Video", "Converter", "Utility"],
        paidAlternative: "Adobe Media Encoder",
        features: ["Transcoding", "Presets", "Batch Scan"]
    }
];
