/**
 * One-time / admin: upload images from a folder into Storage bucket
 * `payslip_app_backgrounds` and upsert rows in `payslip_app_backgrounds`.
 *
 * Requires in repo root `.env` or `.env.local` (never ship service role in the app):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node scripts/sync-app-backgrounds-to-supabase.cjs
 *   node scripts/sync-app-backgrounds-to-supabase.cjs "C:\path\to\images"
 *
 * Run supabase/migrations/014_payslip_app_backgrounds_storage.sql first.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");
function loadEnvFiles() {
  for (const name of [".env", ".env.local"]) {
    const p = path.join(REPO_ROOT, name);
    if (fs.existsSync(p)) {
      require("dotenv").config({ path: p });
    }
  }
}
loadEnvFiles();

const { createClient } = require("@supabase/supabase-js");

const BUCKET = "payslip_app_backgrounds";
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
/** Matches renderer.js DEFAULT_APP_BACKGROUND_HREF — listed first in the picker catalog. */
const DEFAULT_WALLPAPER_BASENAME =
  "yosemite-valley-mountain-range-pine-trees-dawn-clear-sky-5k-6582x4259-2450.jpg";

function prettyLabel(filename) {
  const base = path.basename(filename, path.extname(filename));
  if (!base) return "Background";
  return base
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((w) => {
      const lw = w.toLowerCase();
      if (lw === "bg") return "BG";
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function listImageFiles(dir) {
  /** @type {string[]} */
  const out = [];
  let names;
  try {
    names = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.error("Cannot read directory:", dir, e);
    process.exit(1);
  }
  for (const ent of names) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (EXT.has(ext)) {
      out.push(path.join(dir, ent.name));
    }
  }
  out.sort((a, b) => {
    const aDef = path.basename(a) === DEFAULT_WALLPAPER_BASENAME;
    const bDef = path.basename(b) === DEFAULT_WALLPAPER_BASENAME;
    if (aDef && !bDef) return -1;
    if (!aDef && bDef) return 1;
    return path.basename(a).localeCompare(path.basename(b), "en");
  });
  return out;
}

function contentTypeForExt(ext) {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

async function main() {
  const supabaseUrl = String(process.env.SUPABASE_URL || "").trim();
  const serviceKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  ).trim();
  if (!supabaseUrl || !serviceKey) {
    const envPath = path.join(REPO_ROOT, ".env");
    const missing = [];
    if (!supabaseUrl) {
      missing.push("SUPABASE_URL");
    }
    if (!serviceKey) {
      missing.push("SUPABASE_SERVICE_ROLE_KEY");
    }
    const hasAnon = Boolean(String(process.env.SUPABASE_ANON_KEY || "").trim());
    console.error("Sync needs credentials that are not set (or are empty):");
    console.error(`  Missing: ${missing.join(", ")}`);
    console.error(`  Looked in: ${envPath} and ${path.join(REPO_ROOT, ".env.local")}`);
    console.error(
      "  Add them to .env (copy from .env.example), then re-run npm run sync:app-backgrounds.",
    );
    console.error(
      "  SUPABASE_SERVICE_ROLE_KEY: Supabase Dashboard → Project Settings → API → service_role (secret).",
    );
    console.error(
      "  SUPABASE_ANON_KEY is not enough for this script; do not put the service role in the Electron app.",
    );
    if (hasAnon && !serviceKey) {
      console.error(
        "  (You already have SUPABASE_ANON_KEY — add SUPABASE_SERVICE_ROLE_KEY on the next line.)",
      );
    }
    process.exit(1);
  }

  const dir =
    process.argv[2] || path.join(REPO_ROOT, "assets", "app-backgrounds");
  const files = listImageFiles(dir);
  if (files.length === 0) {
    console.error("No image files in:", dir);
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const baseUrl = supabaseUrl.replace(/\/+$/, "");
  let sort = 0;

  for (const full of files) {
    const name = path.basename(full);
    const objectPath = `wallpapers/${name}`;
    const buf = fs.readFileSync(full);
    const ext = path.extname(name);
    const ct = contentTypeForExt(ext);

    const { error: upErr } = await admin.storage
      .from(BUCKET)
      .upload(objectPath, buf, {
        contentType: ct,
        upsert: true,
      });
    if (upErr) {
      console.error("Upload failed:", objectPath, upErr.message);
      process.exit(1);
    }

    const imageUrl = `${baseUrl}/storage/v1/object/public/${BUCKET}/${objectPath}`;
    const label = prettyLabel(name);

    const { error: rowErr } = await admin
      .from("payslip_app_backgrounds")
      .upsert(
        {
          label,
          sort_order: sort,
          image_url: imageUrl,
          is_active: true,
        },
        { onConflict: "image_url" },
      );
    if (rowErr) {
      console.error("Row upsert failed:", imageUrl, rowErr.message);
      process.exit(1);
    }
    console.log("OK", sort, label, "→", imageUrl);
    sort += 10;
  }

  console.log("Done.", files.length, "file(s).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
