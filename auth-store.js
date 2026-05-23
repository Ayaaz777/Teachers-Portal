/**
 * Only this address is treated as admin (full Notion access) after Supabase sign-in.
 * Must match the user's email from Supabase Auth (case-insensitive).
 * Also insert this exact email into Supabase public.app_admins so the admin can list
 * all teachers (see supabase/migrations/003_admin_teacher_directory.sql).
 */
const ALLOWED_ADMIN_EMAIL = "inforecruitmyenglish@gmail.com";

/**
 * Returns true when the signed-in email matches ALLOWED_ADMIN_EMAIL (case-insensitive).
 * The renderer passes the email from the live Supabase session — this module has no
 * direct access to it. Real protection lives in Supabase RLS; this check only gates UI.
 * @param {string} signedInEmail
 * @returns {boolean}
 */
function hasAdmin(signedInEmail) {
  const a = String(signedInEmail || "").trim().toLowerCase();
  const b = String(ALLOWED_ADMIN_EMAIL || "").trim().toLowerCase();
  return a !== "" && a === b;
}

module.exports = {
  hasAdmin,
  ALLOWED_ADMIN_EMAIL,
};
