import { execSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'msnc-web.zip');

function wipe(target) {
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
}

wipe(dist);
wipe(out);

execSync('npx vite build', { cwd: root, stdio: 'inherit' });

if (!existsSync(dist) || readdirSync(dist).length === 0) {
  console.error('dist/ is empty after build.');
  process.exit(1);
}

execSync('zip -r -q -X ../msnc-web.zip .', { cwd: dist, stdio: 'inherit' });

const files = readdirSync(path.join(dist, 'assets')).join(', ');
console.log(`Created ${out}`);
console.log(`Assets: ${files}`);
