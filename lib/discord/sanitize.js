/**
 * Sanitize AI output for Discord text channels:
 * - Convert [emph]...[/emph] -> **...** (Discord bold)
 * - Remove [pause=NNN] tokens entirely
 * - Strip any other bracketed SSML-like tags ([slow], [/slow], [chuckle], etc.)
 * - Collapse excessive whitespace
 */
function sanitizeForDiscord(input) {
    if (input == null) return "";
    let s = String(input);

    // Convert [emph]...[/emph] to bold **...**
    s = s.replace(/\[emph\]([\s\S]*?)\[\/emph\]/gi, (m, p1) => {
        // Trim inner text
        const inner = String(p1 || "").trim();
        if (!inner) return "";
        return `**${inner}**`;
    });

    // Remove pause tokens like [pause=300]
    s = s.replace(/\[pause=\d+\]/gi, "");

    // Remove any remaining bracketed tags like [slow], [/slow], [chuckle], [fast], [/fast], etc.
    // Preserve inner text for tags that have closing tags (e.g. [slow]text[/slow]) since those were
    // handled above for [emph]. For standalone tags like [chuckle] just drop them.
    // A broad replace will remove leftover single tags and closing tags.
    s = s.replace(/\[\/?[a-z0-9_\-]+(?:=[^\]]+)?\]/gi, "");

    // Collapse multiple blank lines and trim
    s = s.replace(/\r\n/g, "\n");
    s = s.replace(/\n{3,}/g, "\n\n");
    s = s.trim();
    return s;
}

module.exports = { sanitizeForDiscord };
