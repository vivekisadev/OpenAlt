
console.log("Checking Environment Variables...");
console.log("DATABASE_URL is set:", !!process.env.DATABASE_URL);
console.log("DIRECT_URL is set:", !!process.env.DIRECT_URL);

if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL host:", new URL(process.env.DATABASE_URL).host);
}
if (process.env.DIRECT_URL) {
    console.log("DIRECT_URL host:", new URL(process.env.DIRECT_URL).host);
}
