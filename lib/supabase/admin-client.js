const { createClient } = require("@supabase/supabase-js");

let _client = null;

function getAdminClient() {
	if (_client) return _client;
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		return null;
	}
	_client = createClient(url, key, {
		auth: { autoRefreshToken: false, persistSession: false },
	});
	return _client;
}

module.exports = { getAdminClient };
