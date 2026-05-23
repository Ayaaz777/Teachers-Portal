const { spawn } = require("child_process");
const { Readable, PassThrough } = require("stream");
const ffmpegPath = require("ffmpeg-static");

const OUTPUT_SAMPLE_RATE = 48000;
const OUTPUT_BITS_PER_SAMPLE = 24;
const OUTPUT_CHANNELS = 2;

/**
 * Pipe raw PCM s16le through FFmpeg broadcast-grade filter chain.
 * Returns a Readable stream of processed stereo 48kHz PCM s16le.
 */
function streamThroughMaster({ inputStream, inputSampleRate, signal }) {
	if (!ffmpegPath) {
		console.warn("[studio-master] ffmpeg-static not found, bypassing");
		return inputStream;
	}

	const chain = [
		"highpass=f=70",
		"equalizer=f=7000:width_type=h:width=2000:g=-3",
		"acompressor=ratio=2:threshold=-18dB:attack=10:release=100",
		"equalizer=f=320:width_type=q:width=1:g=-1.5",
		"equalizer=f=3000:width_type=q:width=1.5:g=1",
		"highshelf=f=10000:width=1000:gain=1",
		"aecho=0.8:0.7:40|60:0.4|0.25",
		"alimiter=limit=-1.0dB:attack=0.1:release=1",
		"volume=1.0",
		"aresample=48000:resampler=swr:precision=28",
		"aformat=sample_fmts=s32:channel_layouts=stereo",
	];

	const child = spawn(ffmpegPath, [
		"-hide_banner",
		"-loglevel", "error",
		"-threads", "2",
		"-f", "s16le",
		"-ar", String(inputSampleRate),
		"-ac", "1",
		"-i", "pipe:0",
		"-af", chain.join(","),
		"-f", "s32le",
		"-ar", String(OUTPUT_SAMPLE_RATE),
		"-ac", String(OUTPUT_CHANNELS),
		"pipe:1",
	], { stdio: ["pipe", "pipe", "pipe"] });

	child.on("spawn", () => {
		console.log("[studio-master] filter graph initialized");
	});

	let aborted = false;
	if (signal) {
		const onAbort = () => {
			aborted = true;
			child.kill("SIGTERM");
		};
		signal.addEventListener("abort", onAbort, { once: true });
		child.on("exit", () => signal.removeEventListener("abort", onAbort));
	}

	inputStream.pipe(child.stdin);
	child.stdin.on("error", () => { /* ffmpeg may close stdin early — suppress writeEOF */ });

	child.stderr.on("data", (d) => {
		const text = d.toString().trim();
		if (text) console.log("[studio-master]", text);
	});

	const outStream = new PassThrough({ highWaterMark: 65536 });

	child.stdout.on("data", (chunk) => {
		if (!aborted) outStream.push(chunk);
	});

	child.stdout.on("end", () => {
		if (!aborted) outStream.push(null);
	});

	child.stdout.on("error", (err) => {
		console.warn("[studio-master] stdout error:", err.message);
		if (!aborted) outStream.destroy(err);
	});

	child.on("error", (err) => {
		console.warn("[studio-master] spawn error:", err.message);
		inputStream.unpipe(child.stdin);
		inputStream.pipe(outStream);
	});

	child.on("exit", (code) => {
		if (code !== 0 && !aborted) {
			console.warn("[studio-master] ffmpeg exited code=" + code);
		}
	});

	return outStream;
}

/**
 * Find the byte offset where PCM data starts in a WAV buffer,
 * scanning RIFF chunks so extra chunks (fact, LIST, etc.) don't corrupt parsing.
 */
function findDataOffset(buf) {
	if (buf.length < 12) return 44;
	let offset = 12;
	while (offset + 8 <= buf.length) {
		const chunkId = buf.toString("ascii", offset, offset + 4);
		const chunkSize = buf.readUInt32LE(offset + 4);
		if (chunkId === "data") return offset + 8;
		offset += 8 + chunkSize + (chunkSize % 2);
	}
	return 44;
}

/**
 * Process a complete WAV buffer through the studio chain.
 * Input: WAV buffer (any sample rate, mono)
 * Output: WAV buffer (48kHz stereo s16le)
 */
async function processWavBuffer(inputWav, inputSampleRate, signal) {
	if (!ffmpegPath) return inputWav;

	const dataOffset = findDataOffset(inputWav);
	const pcmData = inputWav.subarray(dataOffset);
	const inputStream = new Readable();
	inputStream.push(pcmData);
	inputStream.push(null);

	const outputStream = streamThroughMaster({ inputStream, inputSampleRate, signal });
	const chunks = [];
	try {
		for await (const chunk of outputStream) {
			chunks.push(chunk);
		}
	} catch {
		console.warn("[studio-master] processing failed, returning original");
		return inputWav;
	}

	if (chunks.length === 0) return inputWav;
	const processedPcm = Buffer.concat(chunks);
	if (processedPcm.length === 0) return inputWav;
	const header = buildWavHeader(processedPcm.length, OUTPUT_SAMPLE_RATE, OUTPUT_CHANNELS, OUTPUT_BITS_PER_SAMPLE);
	return Buffer.concat([header, processedPcm]);
}

function buildWavHeader(dataSize, sampleRate, channels, bitsPerSample) {
	const h = Buffer.alloc(44);
	const byteRate = sampleRate * channels * (bitsPerSample / 8);
	const blockAlign = channels * (bitsPerSample / 8);
	h.write("RIFF", 0);
	h.writeUInt32LE(36 + dataSize, 4);
	h.write("WAVE", 8);
	h.write("fmt ", 12);
	h.writeUInt32LE(16, 16);
	h.writeUInt16LE(1, 20);
	h.writeUInt16LE(channels, 22);
	h.writeUInt32LE(sampleRate, 24);
	h.writeUInt32LE(byteRate, 28);
	h.writeUInt16LE(blockAlign, 32);
	h.writeUInt16LE(bitsPerSample, 34);
	h.write("data", 36);
	h.writeUInt32LE(dataSize, 40);
	return h;
}

module.exports = { streamThroughMaster, processWavBuffer, findDataOffset };
