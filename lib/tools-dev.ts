
// Category: Development, DevOps, Security, Database

export const toolsDev = [
    // --- Security ---
    {
        name: "Bitwarden",
        category: "Security",
        description: "Open source password manager.",
        url: "https://bitwarden.com",
        githubUrl: "https://github.com/bitwarden/server",
        tags: ["Passwords", "Security", "Encryption"],
        paidAlternative: "1Password / LastPass",
        features: ["End-to-end Encryption", "Cross-platform", "Sharing"]
    },
    {
        name: "Passbolt",
        category: "Security",
        description: "Password manager for teams.",
        url: "https://www.passbolt.com",
        githubUrl: "https://github.com/passbolt/passbolt_api",
        tags: ["Security", "Teams", "Passwords"],
        paidAlternative: "1Password Business",
        features: ["Team Sharing", "GPG Auth", "Api Centric"]
    },
    {
        name: "Infisical",
        category: "Security",
        description: "Open source secret management platform.",
        url: "https://infisical.com",
        githubUrl: "https://github.com/Infisical/infisical",
        tags: ["Secrets", "DevOps", "Config"],
        paidAlternative: "HashiCorp Vault",
        features: ["Secret Sync", "Audit Logs", "Encryption"]
    },
    {
        name: "Phase",
        category: "Security",
        description: "Securely manage secrets and environment variables.",
        url: "https://phase.dev",
        githubUrl: "https://github.com/phasehq/console",
        tags: ["Secrets", "DevOps", "Encryption"],
        paidAlternative: "Doppler",
        features: ["E2E Encryption", "Environment Sync", "Team Access"]
    },
    {
        name: "Authentik",
        category: "Security",
        description: "The authentication provider that fits your stack.",
        url: "https://goauthentik.io",
        githubUrl: "https://github.com/goauthentik/authentik",
        tags: ["Auth", "SSO", "Identity"],
        paidAlternative: "Okta / Auth0",
        features: ["SSO", "MFA", "LDAP"]
    },
    {
        name: "Zitadel",
        category: "Security",
        description: "Identity infrastructure for developers.",
        url: "https://zitadel.com",
        githubUrl: "https://github.com/zitadel/zitadel",
        tags: ["Auth", "Identity", "Cloud Native"],
        paidAlternative: "Auth0",
        features: ["Multi-tenancy", "Audit Trail", "Serverless"]
    },
    {
        name: "SuperTokens",
        category: "Security",
        description: "Open source alternative to Auth0.",
        url: "https://supertokens.com",
        githubUrl: "https://github.com/supertokens/supertokens-core",
        tags: ["Auth", "Session", "Identity"],
        paidAlternative: "Auth0",
        features: ["Passwordless", "Social Login", "Session Management"]
    },
    {
        name: "Clerk (Open Source Components)",
        category: "Security",
        description: "Authenticate and manage users.",
        url: "https://clerk.com",
        githubUrl: "https://github.com/clerk/javascript", // SDKs are open
        tags: ["Auth", "User Management", "React"],
        paidAlternative: "Auth0",
        features: ["Drop-in Components", "MFA", "Organizations"]
    },
    // --- DevOps & Infrastructure ---
    {
        name: "Coolify",
        category: "DevOps",
        description: "Open source Heroku / Vercel alternative.",
        url: "https://coolify.io",
        githubUrl: "https://github.com/coollabsio/coolify",
        tags: ["Deploy", "Hosting", "Serverless"],
        paidAlternative: "Heroku / Vercel",
        features: ["Self-hosted", "Docker", "Git Push Deploy"]
    },
    {
        name: "Dokku",
        category: "DevOps",
        description: "Docker powered mini-Heroku.",
        url: "https://dokku.com",
        githubUrl: "https://github.com/dokku/dokku",
        tags: ["PaaS", "Docker", "Deploy"],
        paidAlternative: "Heroku",
        features: ["Git Push", "Plugins", "Simple Config"]
    },
    {
        name: "Kamal",
        category: "DevOps",
        description: "Deploy web apps anywhere.",
        url: "https://kamal-deploy.org",
        githubUrl: "https://github.com/basecamp/kamal",
        tags: ["Deploy", "Containers", "DevOps"],
        paidAlternative: "Kubernetes (Complex)",
        features: ["Zero Downtime", "Multi-host", "Simple"]
    },
    {
        name: "Uptime Kuma",
        category: "DevOps",
        description: "Self-hosted monitoring tool.",
        url: "https://uptime.kuma.pet", // Correct URL
        githubUrl: "https://github.com/louislam/uptime-kuma",
        tags: ["Monitoring", "Status", "Uptime"],
        paidAlternative: "Uptime Robot",
        features: ["Status Pages", "Notifications", "Charts"]
    },
    {
        name: "Grafana",
        category: "DevOps",
        description: "The open observability platform.",
        url: "https://grafana.com",
        githubUrl: "https://github.com/grafana/grafana",
        tags: ["Monitoring", "Analytics", "Dashboards"],
        paidAlternative: "Datadog",
        features: ["Visualizations", "Alerting", "Plugins"]
    },
    {
        name: "Prometheus",
        category: "DevOps",
        description: "Monitoring system and time series database.",
        url: "https://prometheus.io",
        githubUrl: "https://github.com/prometheus/prometheus",
        tags: ["Monitoring", "Metrics", "Database"],
        paidAlternative: "Datadog",
        features: ["Multi-dimensional Data", "PromQL", "Alert Manager"]
    },
    {
        name: "SigNoz",
        category: "DevOps",
        description: "Open source observability platform.",
        url: "https://signoz.io",
        githubUrl: "https://github.com/SigNoz/signoz",
        tags: ["Observability", "Tracing", "Metrics"],
        paidAlternative: "Datadog / New Relic",
        features: ["APM", "Logs", "Traces"]
    },
    {
        name: "Gitea",
        category: "DevOps",
        description: "Git with a cup of tea.",
        url: "https://gitea.io",
        githubUrl: "https://github.com/go-gitea/gitea",
        tags: ["Git", "Version Control", "Self-hosted"],
        paidAlternative: "GitHub / GitLab",
        features: ["Lightweight", "Cross-platform", "CI/CD"]
    },
    {
        name: "Woodpecker CI",
        category: "DevOps",
        description: "Community-fork of Drone CI.",
        url: "https://woodpecker-ci.org",
        githubUrl: "https://github.com/woodpecker-ci/woodpecker",
        tags: ["CI/CD", "Automation", "Pipelines"],
        paidAlternative: "CircleCI",
        features: ["Container-based", "Plugins", "Simple YAML"]
    },
    {
        name: "Act",
        category: "DevOps",
        description: "Run your GitHub Actions locally.",
        url: "https://nektos.com/act",
        githubUrl: "https://github.com/nektos/act",
        tags: ["CI/CD", "GitHub Actions", "Utility"],
        paidAlternative: "Cloud Runners",
        features: ["Local Testing", "Fast Feedback", "Docker"]
    },
    // --- Database & Backend ---
    {
        name: "Supabase",
        category: "Database",
        description: "The Open Source Firebase Alternative.",
        url: "https://supabase.com",
        githubUrl: "https://github.com/supabase/supabase",
        tags: ["BaaS", "Postgres", "Realtime"],
        paidAlternative: "Firebase",
        features: ["Auth", "Database", "Storage", "Edge Functions"]
    },
    {
        name: "PocketBase",
        category: "Database",
        description: "Open Source backend in 1 file.",
        url: "https://pocketbase.io",
        githubUrl: "https://github.com/pocketbase/pocketbase",
        tags: ["BaaS", "Go", "SQLite"],
        paidAlternative: "Firebase",
        features: ["Realtime", "Auth", "Admin Dashboard"]
    },
    {
        name: "Appwrite",
        category: "Database",
        description: "Secure Open Source Backend for Web, Mobile & Flutter Developers.",
        url: "https://appwrite.io",
        githubUrl: "https://github.com/appwrite/appwrite",
        tags: ["BaaS", "Backend", "Self-hosted"],
        paidAlternative: "Firebase",
        features: ["Database", "Auth", "Functions", "Storage"]
    },
    {
        name: "NocoDB",
        category: "Database",
        description: "Open Source Airtable Alternative.",
        url: "https://nocodb.com",
        githubUrl: "https://github.com/nocodb/nocodb",
        tags: ["No-Code", "Database", "Spreadsheet"],
        paidAlternative: "Airtable",
        features: ["Smart Spreadsheet", "REST API", "GraphQL"]
    },
    {
        name: "Baserow",
        category: "Database",
        description: "Open source no-code database.",
        url: "https://baserow.io",
        githubUrl: "https://github.com/bram2w/baserow",
        tags: ["No-Code", "Database", "Collaboration"],
        paidAlternative: "Airtable",
        features: ["Real-time", "Templates", "API"]
    },
    {
        name: "Redis",
        category: "Database",
        description: "In-memory data structure store.",
        url: "https://redis.io",
        githubUrl: "https://github.com/redis/redis",
        tags: ["Cache", "Database", "Performance"],
        paidAlternative: "Memcached (Enterprise)",
        features: ["Caching", "Pub/Sub", "Streaming"]
    },
    {
        name: "PostgreSQL",
        category: "Database",
        description: "The World's Most Advanced Open Source Relational Database.",
        url: "https://www.postgresql.org",
        githubUrl: "https://github.com/postgres/postgres",
        tags: ["SQL", "Relational", "ACID"],
        paidAlternative: "Oracle DB",
        features: ["Robustness", "Extensibility", "JSONB"]
    },
    {
        name: "Meilisearch",
        category: "Database",
        description: "Lightning fast, ultra relevant search engine.",
        url: "https://www.meilisearch.com",
        githubUrl: "https://github.com/meilisearch/meilisearch",
        tags: ["Search", "Engine", "Instant"],
        paidAlternative: "Algolia",
        features: ["Typo-tolerance", "Fast", "Easy Deploy"]
    },
    {
        name: "Typesense",
        category: "Database",
        description: "Open Source alternative to Algolia + Pinecone.",
        url: "https://typesense.org",
        githubUrl: "https://github.com/typesense/typesense",
        tags: ["Search", "Vector", "Fast"],
        paidAlternative: "Algolia",
        features: ["Typo-tolerance", "Vector Search", "Geosearch"]
    }
];
