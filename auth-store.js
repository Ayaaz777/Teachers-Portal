/**
 * Only this address is treated as admin (full Notion access) after Supabase sign-in.
 * Must match the user's email from Supabase Auth (case-insensitive).
 * Also insert this exact email into Supabase public.app_admins so the admin can list
 * all teachers (see supabase/migrations/003_admin_teacher_directory.sql).
 */
const ALLOWED_ADMIN_EMAIL = "inforecruitmyenglish@gmail.com";

/**
 * @param {string} _userDataPath
 * @returns {boolean}
 */
function hasAdmin(_userDataPath) {
  return true;
}

module.exports = {
  hasAdmin,
  ALLOWED_ADMIN_EMAIL,
};
