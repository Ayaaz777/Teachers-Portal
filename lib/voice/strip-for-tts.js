// lib/voice/strip-for-tts.js
// Remove markdown and prosody-meta tags before sending text to TTS.
// Chatterbox-Turbo ignores expression controls; leaving tags in causes them
// to be spoken literally. Strip everything; rely on punctuation for rhythm.

function stripForTTS(input) {
    if (!input) return '';
    let s = String(input);

    // Remove pause/prosody/emotion meta tags entirely
    s = s.replace(/\[pause=[^\]]*\]/gi, '');
    s = s.replace(/\[break=[^\]]*\]/gi, '');
    s = s.replace(/\[emphasis=[^\]]*\]/gi, '');
    s = s.replace(/\[emph\]/gi, '');
    s = s.replace(/\[\/emph\]/gi, '');
    s = s.replace(/\[slow\]/gi, '');
    s = s.replace(/\[\/slow\]/gi, '');
    s = s.replace(/\[fast\]/gi, '');
    s = s.replace(/\[\/fast\]/gi, '');
    s = s.replace(/\[chuckle\]/gi, '');
    s = s.replace(/\[laugh\]/gi, '');
    s = s.replace(/\[sigh\]/gi, '');

    // Remove fenced code blocks entirely (don't read code aloud)
    s = s.replace(/```[\s\S]*?```/g, ' ');

    // Inline code backticks — keep inner text
    s = s.replace(/`([^`]*)`/g, '$1');

    // Bold ** ** and __ __ — keep inner text
    s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
    s = s.replace(/__([^_]+)__/g, '$1');

    // Italic * * and _ _ — keep inner text
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2');
    s = s.replace(/(^|[^_])_([^_\n]+)_/g, '$1$2');

    // Headings at line start
    s = s.replace(/^#{1,6}\s+/gm, '');

    // Bullet markers at line start
    s = s.replace(/^\s*[-*+]\s+/gm, '');
    s = s.replace(/^\s*\d+\.\s+/gm, '');

    // Blockquote markers
    s = s.replace(/^\s*>\s+/gm, '');

    // Links: [text](url) → text
    s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

    // Stray HTML tags
    s = s.replace(/<[^>]+>/g, '');

    // Collapse 3+ newlines to 2
    s = s.replace(/\n{3,}/g, '\n\n');

    return s.trim();
}

module.exports = { stripForTTS };
