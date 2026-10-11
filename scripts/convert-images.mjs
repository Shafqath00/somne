/**
 * One-time image conversion script: PNG/JPG → WebP
 * 
 * Usage:
 *   npm install sharp --save-dev  (only needed once)
 *   node scripts/convert-images.mjs
 * 
 * All converted WebP files are saved alongside originals in /public.
 * After running, update HeroSection.tsx and index.html to reference .webp versions.
 */

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "../public");

const CONVERT_EXTENSIONS = [".png", ".jpg", ".jpeg"];
const QUALITY = 82; // Good balance of quality vs. file size (0–100)

async function getAllImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllImages(fullPath)));
    } else if (CONVERT_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertToWebP(filePath) {
  const ext = extname(filePath);
  const webpPath = filePath.replace(ext, ".webp");

  const inputStat = await stat(filePath);
  const inputSizeMB = (inputStat.size / 1024 / 1024).toFixed(2);

  await sharp(filePath)
    .webp({ quality: QUALITY })
    .toFile(webpPath);

  const outputStat = await stat(webpPath);
  const outputSizeMB = (outputStat.size / 1024 / 1024).toFixed(2);
  const saving = (((inputStat.size - outputStat.size) / inputStat.size) * 100).toFixed(0);

  console.log(
    `✅ ${basename(filePath).padEnd(35)} ${inputSizeMB}MB → ${outputSizeMB}MB (${saving}% smaller)`
  );
}

async function main() {
  console.log("🔍 Scanning /public for PNG and JPG images...\n");
  const images = await getAllImages(PUBLIC_DIR);
  console.log(`Found ${images.length} image(s) to convert.\n`);

  let totalSavedBytes = 0;
  for (const img of images) {
    try {
      const before = (await stat(img)).size;
      await convertToWebP(img);
      const webpPath = img.replace(extname(img), ".webp");
      const after = (await stat(webpPath)).size;
      totalSavedBytes += before - after;
    } catch (err) {
      console.error(`❌ Failed to convert ${img}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log("\n📌 Next steps:");
  console.log("   1. Update /public/Somnehero2.png → .webp in HeroSection.tsx and index.html");
  console.log("   2. Update /public/Somneheromobile2.png → .webp in HeroSection.tsx and index.html");
  console.log("   3. Update any other <img> src paths in your components to use .webp");
  console.log("   4. Test locally, then deploy.\n");
}

main().catch(console.error);
