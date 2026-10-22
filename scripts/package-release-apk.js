import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const builtApkPath = path.resolve(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
const releaseApkName = 'mature-prompt-studio-v1.1.0.apk';

const targets = [
  path.resolve(__dirname, '../release', releaseApkName),
  path.resolve(__dirname, '../public', releaseApkName),
  path.resolve(__dirname, '../dist', releaseApkName),
];

if (!fs.existsSync(builtApkPath)) {
  console.error(`ERROR: Built APK not found at: ${builtApkPath}`);
  process.exit(1);
}

const stats = fs.statSync(builtApkPath);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`Found built APK: ${builtApkPath} (${sizeMB} MB)`);

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(builtApkPath, target);
  console.log(`✓ Copied to: ${target}`);
}

console.log(`\n🎉 Release APK (${releaseApkName}, ${sizeMB} MB) successfully packaged and distributed for download!`);
