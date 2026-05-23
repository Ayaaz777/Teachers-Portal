const Anthropic = require("@anthropic-ai/sdk");
const voiceMemory = require("./supabase/voice-memory");
const { log } = require("./log");

const DISTILL_MODEL = "claude-haiku-3-5-20241022";
const DISTILL_MAX_TOKENS = 1024;
const DISTILL_PROMPT = `Read the conversation turns below and extract 3-5 distinct facts the user would want remembered. Output each fact on its own line in the format: fact_key: fact_value

Rules:
- fact_key must be lowercase_snake_case, short and descriptive
- fact_value must be the exact value stated by the user, not paraphrased
- Only include facts that are explicitly stated or clearly implied
- Skip greetings, farewells, and meta-conversation
- If fewer than 3 facts are present, output only what's justified

Example output:
teacher_sam_smith_status: PENDING
preferred_school: Magic English SA
payslip_month: May 2026`;

async function distillSession({ userEmail, messageCount }) {
	try {
		const apiKey = process.env.ANTHROPIC_API_KEY;
		if (!apiKey) {
			return { ok: false, error: "ANTHROPIC_API_KEY not set" };
		}

		const convResult = await voiceMemory.getRecentConversations({
			userEmail,
			limit: messageCount || 50,
		});
		if (!convResult.ok || !Array.isArray(convResult.data) || convResult.data.length === 0) {
			return { ok: false, error: "No conversations to distill" };
		}

		const turns = convResult.data
			.slice()
			.reverse()
			.map(row => `${row.turn_role === "assistant" ? "Assistant" : "User"}: ${row.content}`)
			.join("\n\n");

		const anthropic = new Anthropic({ apiKey });
		const res = await anthropic.messages.create({
			model: DISTILL_MODEL,
			max_tokens: DISTILL_MAX_TOKENS,
			system: DISTILL_PROMPT,
			messages: [{ role: "user", content: turns }],
		});

		const text = res.content?.[0]?.text || "";
		if (!text.trim()) {
			return { ok: true, data: { factsStored: 0, facts: [] } };
		}

		const facts = [];
		for (const line of text.trim().split("\n")) {
			const sep = line.indexOf(": ");
			if (sep > 0) {
				const key = line.slice(0, sep).trim();
				const value = line.slice(sep + 2).trim();
				if (key && value) {
					facts.push({ key, value });
				}
			}
		}

		let storedCount = 0;
		for (const f of facts) {
			const result = await voiceMemory.storeFact({
				userEmail,
				key: f.key,
				value: f.value,
				sourceCid: "distillation",
				confidence: 0.7,
			});
			if (result.ok) storedCount++;
		}

		log.info("distill", { userEmail, inputTurns: convResult.data.length, factsExtracted: facts.length, factsStored: storedCount });
		return { ok: true, data: { factsStored: storedCount, facts } };
	} catch (e) {
		log.info("distill", { exception: e instanceof Error ? e.message : String(e) });
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	}
}

let turnCounter = 0;

async function maybeDistill({ userEmail, interval }) {
	turnCounter++;
	if (turnCounter >= (interval || 50)) {
		turnCounter = 0;
		const result = await distillSession({ userEmail, messageCount: 50 });
		if (result.ok) {
			log.info("distill", { autoDistill: true, factsStored: result.data.factsStored });
		}
		return result;
	}
	return { ok: true, skipped: true };
}

function resetTurnCounter() {
	turnCounter = 0;
}

module.exports = { distillSession, maybeDistill, resetTurnCounter };
