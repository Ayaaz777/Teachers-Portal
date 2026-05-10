/** One-off script: neutral dark pixels → transparent (keeps saturated logo colors). */
const path = require("path");
const Jimp = require("jimp");

const src = path.join(__dirname, "..", "assets", "rme-logo.png");

(async () => {
  const img = await Jimp.read(src);
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const sum = r + g + b;
    const chroma = max - min;
    /** Black / gray backdrop only; saturated purple-orange brand colors stay opaque. */
    const remove =
      sum < 38 ||
      (sum < 95 && chroma < 14) ||
      (max < 22 && chroma < 35);
    this.bitmap.data[idx + 3] = remove ? 0 : 255;
  });
  await img.writeAsync(src);
})();
