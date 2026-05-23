const TAG_TYPES = { slow: 'SLOW', fast: 'FAST', emph: 'EMPH' };

function stripProsodyTags(text) {
	let t = String(text ?? "");
	t = t.replace(/\[pause\s*=\s*\d+\]/gi, ", ");
	t = t.replace(/\[\/?slow\]/gi, "");
	t = t.replace(/\[\/?fast\]/gi, "");
	t = t.replace(/\[\/?emph\]/gi, "");
	return t;
}

function toSsml(text) {
	let t = String(text ?? "");

	t = t.replace(/\[pause\s*=\s*(\d+)\]/gi, '<break time="$1ms"/>');

	/* Convert Claude tags to unique markers so each type can be balanced separately */
	t = t.replace(/\[slow\]/gi, '<<OPEN_SLOW>>');
	t = t.replace(/\[\/slow\]/gi, '<<CLOSE_SLOW>>');
	t = t.replace(/\[fast\]/gi, '<<OPEN_FAST>>');
	t = t.replace(/\[\/fast\]/gi, '<<CLOSE_FAST>>');
	t = t.replace(/\[emph\]/gi, '<<OPEN_EMPH>>');
	t = t.replace(/\[\/emph\]/gi, '<<CLOSE_EMPH>>');

	/* Balance each tag type: strip excess opens or closes */
	for (const [tag, key] of Object.entries(TAG_TYPES)) {
		const openPat = new RegExp(`<<OPEN_${key}>>`, 'g');
		const closePat = new RegExp(`<<CLOSE_${key}>>`, 'g');
		const opens = (t.match(openPat) || []).length;
		const closes = (t.match(closePat) || []).length;
		const diff = opens - closes;

		if (diff > 0) {
			/* Strip (diff) excess opening tags, removing the last ones */
			let count = 0;
			t = t.replace(openPat, () => (++count <= opens - diff) ? '<<OPEN_SAVED>>' : '');
		} else if (diff < 0) {
			/* Strip (-diff) excess closing tags, removing the first ones */
			let count = 0;
			t = t.replace(closePat, () => {
				count++;
				return (count <= Math.abs(diff)) ? '' : '<<CLOSE_SAVED>>';
			});
		}
	}

	/* Now replace balanced markers with real SSML */
	t = t.replace(/<<OPEN_SAVED>>/g, '<<OPEN_SLOW>>');
	t = t.replace(/<<CLOSE_SAVED>>/g, '<<CLOSE_SLOW>>');
	
	/* Strip any remaining unmatched raw Claude tags */
	t = t.replace(/\[(slow|fast|emph)\]/gi, "");
	t = t.replace(/\[\/(slow|fast|emph)\]/gi, "");
	t = t.replace(/\[pause\s*=\s*\d+\]/gi, ", ");

	/* Replace all saved markers with SSML equivalents */
	t = t.replace(/<<OPEN_SLOW>>/g, '<prosody rate="x-slow">');
	t = t.replace(/<<CLOSE_SLOW>>/g, '</prosody>');
	t = t.replace(/<<OPEN_FAST>>/g, '<prosody rate="x-fast">');
	t = t.replace(/<<CLOSE_FAST>>/g, '</prosody>');
	t = t.replace(/<<OPEN_EMPH>>/g, '<emphasis level="strong">');
	t = t.replace(/<<CLOSE_EMPH>>/g, '</emphasis>');

	return `<speak>${t}</speak>`;
}

module.exports = { stripProsodyTags, toSsml };
