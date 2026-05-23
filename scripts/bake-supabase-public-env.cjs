/**
 * Writes resources/supabase.public.env from the dev machine .env before packaging.
 * Only SUPABASE_URL + SUPABASE_ANON_KEY (safe to ship in the desktop client).
 */
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const outPath = path.join(root, "supabase.public.env");

if (!fs.existsSync(envPath)) {
  console.error(
    "[bake-supabase] Missing .env in project root. Copy .env.example and set SUPABASE_URL + SUPABASE_ANON_KEY.",
  );
  process.exit(1);
}

const parsed = dotenv.parse(fs.readFileSync(envPath, "utf8"));
const url = String(parsed.SUPABASE_URL || "").trim();
const anonKey = String(parsed.SUPABASE_ANON_KEY || "").trim();

if (!url || !anonKey) {
  console.error(
    "[bake-supabase] SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env before npm run dist / npm run release.",
  );
  process.exit(1);
}

const body = [
  "# Baked at build time from the release machine .env — do not commit.",
  `SUPABASE_URL=${url}`,
  `SUPABASE_ANON_KEY=${anonKey}`,
  "",
].join("\n");

fs.writeFileSync(outPath, body, "utf8");
console.log(`[bake-supabase] Wrote ${path.relative(root, outPath)}`);
