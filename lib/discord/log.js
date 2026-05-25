// lib/discord/log.js
// Audit-log every Discord tool call to Supabase.
// Fire-and-forget — failures are logged to console, never thrown.

const { createClient } = require('@supabase/supabase-js');

let _supabase = null;
let _warnedMissingEnv = false;

function getSupabase() {
    if (_supabase) return _supabase;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        if (!_warnedMissingEnv) {
            console.warn('[discord-log] disabled (no Supabase env)');
            _warnedMissingEnv = true;
        }
        return null;
    }
    _supabase = createClient(url, key, { auth: { persistSession: false } });
    return _supabase;
}

async function logDiscordEvent(event) {
    try {
        const sb = getSupabase();
        if (!sb) return;

        const preview = event.content ? String(event.content).slice(0, 200) : null;
        const row = {
            tool_name: event.toolName,
            direction: event.direction,
            status: event.status,
            channel_id: event.channelId || null,
            channel_name: event.channelName || null,
            target_user_id: event.targetUserId || null,
            target_username: event.targetUsername || null,
            content: event.content || null,
            content_preview: preview,
            query: event.query || null,
            result_count: typeof event.resultCount === 'number' ? event.resultCount : null,
            blueprint_match: event.blueprintMatch || null,
            error_message: event.errorMessage || null,
            triggered_by: event.triggeredBy || 'unknown',
            turn_id: event.turnId || null,
            raw_input: event.rawInput || null,
            raw_output: event.rawOutput || null
        };

        const { error } = await sb.from('discord_conversations').insert(row);
        if (error) {
            console.warn('[discord-log] insert failed:', error.message);
        }
    } catch (err) {
        console.warn('[discord-log] unexpected error:', err && err.message || String(err));
    }
}

module.exports = { logDiscordEvent };
