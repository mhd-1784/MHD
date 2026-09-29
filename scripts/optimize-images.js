#!/usr/bin/env node
/**
 * Optimises images uploaded via the CMS.
 *
 * Scans src/images/uploads for raster images and, where beneficial:
 *   - resizes anything wider than MAX_WIDTH down to MAX_WIDTH
 *   - re-encodes at QUALITY to shrink oversized files
 *
 * It writes the optimised image back in place only if the result is
 * meaningfully smaller, so it's safe to run repeatedly (idempotent) and
 * won't degrade already-optimised images.
 *
 * Runs automatically before each build (see package.json "build" script).
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const UPLOADS_DIR = path.join(__dirname, "..", "src", "images", "uploads");
const MAX_WIDTH = 1600;        // cap width for web display
const QUALITY = 80;            // JPEG/WebP quality
const MIN_SAVING = 0.05;       // only rewrite if we save at least 5%
const EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTS.has(ext)) return null;

  const originalSize = fs.statSync(filePath).size;
  const image = sharp(filePath, { failOn: "none" });
  const meta = await image.metadata();

  // Resize only if wider than the cap
  if (meta.width && meta.width > MAX_WIDTH) {
    image.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // Re-encode in the same format
  if (ext === ".png") {
    image.png({ compressionLevel: 9, palette: true });
  } else {
    image.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  const buffer = await image.toBuffer();

  // Only write back if we actually save space
  if (buffer.length < originalSize * (1 - MIN_SAVING)) {
    fs.writeFileSync(filePath, buffer);
    return { file: path.basename(filePath), originalSize, newSize: buffer.length };
  }
  return null;
}

async function run() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log("[optimize-images] No uploads directory, skipping.");
    return;
  }

  const files = fs.readdirSync(UPLOADS_DIR).map(f => path.join(UPLOADS_DIR, f));
  let optimized = 0;
  let savedBytes = 0;

  for (const file of files) {
    try {
      const result = await optimizeFile(file);
      if (result) {
        optimized++;
        savedBytes += result.originalSize - result.newSize;
        const kb = n => (n / 1024).toFixed(0) + "KB";
        console.log(`[optimize-images] ${result.file}: ${kb(result.originalSize)} -> ${kb(result.newSize)}`);
      }
    } catch (err) {
      console.warn(`[optimize-images] Skipped ${path.basename(file)}: ${err.message}`);
    }
  }

  if (optimized > 0) {
    console.log(`[optimize-images] Optimised ${optimized} image(s), saved ${(savedBytes / 1024).toFixed(0)}KB.`);
  } else {
    console.log("[optimize-images] Nothing to optimise.");
  }
}

run();
