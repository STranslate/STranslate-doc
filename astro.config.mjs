import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
// Reuse the built search index in development without copying it into public/.
const devSearch = {
  name: 'stranslate-dev-search',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const url = request.url?.split('?')[0] || '';
      if (!url.startsWith('/pagefind/')) return next();
      const root = path.resolve('dist/pagefind');
      const file = path.resolve('dist', '.' + decodeURIComponent(url));
      if (!file.startsWith(root + path.sep)) return next();
      try {
        const data = await readFile(file);
        const extension = path.extname(file);
        response.setHeader(
          'Content-Type',
          extension === '.js'
            ? 'application/javascript'
            : extension === '.wasm'
              ? 'application/wasm'
              : 'application/octet-stream',
        );
        response.end(data);
      } catch {
        next();
      }
    });
  },
};

export default defineConfig({
  site: 'https://stranslate.zggsong.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [vue(), sitemap()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-high-contrast' } },
  },
  vite: { plugins: [devSearch], server: { host: '127.0.0.1' } },
});
