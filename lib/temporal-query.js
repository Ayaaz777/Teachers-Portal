const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function getMonday(d) {
	const date = new Date(d);
	const day = date.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	date.setDate(date.getDate() + diff);
	date.setHours(0, 0, 0, 0);
	return date;
}

function getSunday(monday) {
	const date = new Date(monday);
	date.setDate(date.getDate() + 6);
	return date;
}

function getMonthRange(year, monthIndex) {
	const start = new Date(year, monthIndex, 1);
	const end = new Date(year, monthIndex + 1, 0);
	return { startDate: start, endDate: end };
}

const MONTH_NAMES = {
	january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
	july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
	jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function today() {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}

function parseTemporalRange(query) {
	if (!query || typeof query !== "string") return null;
	const q = query.trim().toLowerCase();
	const now = today();

	if (/\blast\s+week\b/.test(q)) {
		const monday = getMonday(now);
		monday.setDate(monday.getDate() - 7);
		const sunday = getSunday(monday);
		return { startDate: monday, endDate: sunday, label: "last week" };
	}

	if (/\b(this|current)\s+week\b/.test(q)) {
		const monday = getMonday(now);
		const sunday = getSunday(monday);
		return { startDate: monday, endDate: sunday, label: "this week" };
	}

	if (/\byesterday\b/.test(q)) {
		const d = new Date(now);
		d.setDate(d.getDate() - 1);
		return { startDate: d, endDate: d, label: "yesterday" };
	}

	if (/\btoday\b/.test(q)) {
		return { startDate: now, endDate: now, label: "today" };
	}

	const dayMatch = q.match(/^(last\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
	if (dayMatch) {
		const targetDay = DAY_NAMES.indexOf(dayMatch[2]);
		if (targetDay >= 0) {
			const d = new Date(now);
			const currentDay = d.getDay();
			let diff = targetDay - currentDay;
			if (dayMatch[1]) diff -= 7;
			if (diff > 0) diff -= 7;
			d.setDate(d.getDate() + diff);
			return { startDate: d, endDate: d, label: dayMatch[0] };
		}
	}

	if (/\blast\s+month\b/.test(q)) {
		const y = now.getFullYear();
		const m = now.getMonth();
		if (m === 0) {
			return getMonthRange(y - 1, 11);
		}
		return getMonthRange(y, m - 1);
	}

	const monthMatch = q.match(/\b(in|during)\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/i);
	if (monthMatch) {
		const monthIdx = MONTH_NAMES[monthMatch[2].toLowerCase()];
		if (monthIdx !== undefined) {
			const y = now.getFullYear();
			return getMonthRange(y, monthIdx);
		}
	}

	return null;
}

function hasTemporalScope(query) {
	return parseTemporalRange(query) !== null;
}

module.exports = { parseTemporalRange, hasTemporalScope };
