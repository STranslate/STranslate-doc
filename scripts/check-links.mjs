import { readdir, readFile, stat, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '_astro' || entry.name === 'pagefind') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(fullPath)));
    else if (entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}
const failures = new Set();
// Published files must fit Cloudflare Pages.
async function checkAssetSizes(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await checkAssetSizes(file);
    else if ((await stat(file)).size > 25 * 1024 * 1024)
      failures.add(`File exceeds 25 MiB: ${path.relative(root, file)}`);
  }
}
await checkAssetSizes(root);
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src|poster)="([^"<>]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const url = new URL(href, 'https://stranslate.zggsong.com');
    let target = path.join(root, decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await access(target);
      if (url.hash && target.endsWith('.html')) {
        const content = await readFile(target, 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        if (!content.includes(`id="${id}"`)) throw new Error('Missing anchor');
      }
    } catch {
      failures.add(`${path.relative(root, file)} → ${href}`);
    }
  }
}
if (failures.size) {
  console.error(`Broken local links or assets:\n${[...failures].join('\n')}`);
  process.exitCode = 1;
} else console.log('All generated local links, anchors and media references are valid.');
