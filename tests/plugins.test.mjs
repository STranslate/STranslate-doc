import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { loadPlugin, parseRepo, filterPlugins, pluginCategory } from '../src/lib/plugins.ts';

test('short and community repository entries preserve the existing contract', () => {
  assert.deepEqual(parseRepo('STranslate.Plugin.Translate.Demo'), {
    owner: 'STranslate',
    repo: 'STranslate.Plugin.Translate.Demo',
  });
  assert.deepEqual(parseRepo('someone/plugin'), { owner: 'someone', repo: 'plugin' });
  assert.throws(() => parseRepo('owner/repo/extra'));
  assert.throws(() => parseRepo('/repo'));
  assert.equal(pluginCategory('STranslate.Plugin.Ocr.Demo'), 'Ocr');
});

test('main/master fallback, localization and release URLs', async () => {
  const requested = [];
  const fetcher = async (url) => {
    requested.push(url);
    if (url.includes('/main/')) return new Response('', { status: 404 });
    return Response.json(
      url.endsWith('zh-cn.json')
        ? { Name: '本地翻译', Description: '中文说明' }
        : { Name: 'Translate', Version: '1.2.3', Author: '测试作者' },
    );
  };
  const plugin = await loadPlugin('community/STranslate.Plugin.Translate.Demo', undefined, fetcher);
  assert.equal(plugin.name, '本地翻译');
  assert.equal(plugin.author, '测试作者');
  assert.equal(plugin.official, false);
  assert.equal(plugin.category, 'Translate');
  assert.equal(
    plugin.downloadUrl,
    'https://github.com/community/STranslate.Plugin.Translate.Demo/releases/download/v1.2.3/STranslate.Plugin.Translate.Demo.spkg',
  );
  assert.ok(requested.some((url) => url.includes('/master/')));
});

test('optional localization failure keeps valid metadata and missing text has useful defaults', async () => {
  const plugin = await loadPlugin('STranslate.Plugin.Tts.Demo', undefined, async (url) =>
    url.endsWith('plugin.json')
      ? Response.json({ Version: 'v2.0.0' })
      : new Response('', { status: 404 }),
  );
  assert.equal(plugin.version, '2.0.0');
  assert.equal(plugin.official, true);
  assert.equal(plugin.author, 'STranslate');
  assert.ok(plugin.description);
});

test('malformed metadata and network failures are recoverable failures', async () => {
  await assert.rejects(
    loadPlugin('STranslate.Plugin.Ocr.Bad', undefined, async () =>
      Response.json({ Version: '../../bad' }),
    ),
  );
  await assert.rejects(
    loadPlugin('STranslate.Plugin.Ocr.Bad', undefined, async () => {
      throw new Error('offline');
    }),
  );
});

test('search is case-insensitive, trims input and combines with category', () => {
  const plugins = [
    {
      name: 'Gemini',
      description: '图片识别',
      author: 'Song',
      owner: 'STranslate',
      category: 'Ocr',
    },
    {
      name: 'Gemini Translate',
      description: '翻译',
      author: 'Other',
      owner: 'Community',
      category: 'Translate',
    },
  ];
  assert.equal(filterPlugins(plugins, ' GEMINI ', 'Ocr').length, 1);
  assert.equal(filterPlugins(plugins, '图片', 'All').length, 1);
  assert.equal(filterPlugins(plugins, 'song', 'All').length, 1);
  assert.equal(filterPlugins(plugins, 'missing', 'All').length, 0);
});

test('plugin validator reads the old registry path in a pre-migration git baseline', () => {
  const output = execFileSync(process.execPath, ['scripts/validate-plugins.cjs'], {
    env: { ...process.env, BASE_PLUGINS_REF: 'HEAD' },
    encoding: 'utf8',
  });
  assert.match(output, /No newly added plugin entries/);
});
