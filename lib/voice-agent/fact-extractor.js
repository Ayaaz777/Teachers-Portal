/**
 * Phase 2 — Automatic fact extraction from completed voice turns.
 * Uses Claude Haiku to extract factual statements, preferences, and decisions.
 * Currently stubbed: returns empty array without making API calls.
 */
async function extractAndStore({ userMessage, assistantReply, userEmail, cid }) {
	return { ok: true, data: [] };
}

module.exports = { extractAndStore };
