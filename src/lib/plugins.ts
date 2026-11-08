export type PluginCategory = 'Translate' | 'Ocr' | 'Tts' | 'Vocabulary' | 'Other';
export interface Plugin {
  entry: string;
  owner: string;
  repo: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: PluginCategory;
  official: boolean;
  iconUrl: string;
  website: string;
  downloadUrl: string;
}
export function parseRepo(entry: string) {
  const parts = entry.split('/');
  const [owner, repo] = parts.length === 1 ? ['STranslate', entry] : parts;
  if (parts.length > 2 || !/^[\w.-]+$/.test(owner || '') || !/^[\w.-]+$/.test(repo || ''))
    throw new Error('仓库地址格式无效');
  return { owner, repo };
}
export function pluginCategory(repo: string): PluginCategory {
  const type = repo.split('.')[2];
  return ['Translate', 'Ocr', 'Tts', 'Vocabulary'].includes(type)
    ? (type as PluginCategory)
    : 'Other';
}
async function requestJson(
  url: string,
  fetcher: typeof fetch,
  signal?: AbortSignal,
): Promise<Record<string, unknown>> {
  const response = await fetcher(url, {
    signal: AbortSignal.any([AbortSignal.timeout(8000), ...(signal ? [signal] : [])]),
  });
  if (!response.ok) throw new Error(`GitHub 返回 ${response.status}`);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('插件信息格式无效');
  return data as Record<string, unknown>;
}
const text = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;
export async function loadPlugin(
  entry: string,
  signal?: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<Plugin> {
  const { owner, repo } = parseRepo(entry);
  let lastError: unknown;
  for (const branch of ['main', 'master']) {
    if (signal?.aborted) throw new Error('已取消');
    const base = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${repo}`;
    try {
      let data = await requestJson(`${base}/plugin.json`, fetcher, signal);
      const version = text(data.Version, '').replace(/^v/, '');
      if (!version || !/^[\w.+-]+$/.test(version)) throw new Error('插件版本信息无效');
      try {
        const localized = await requestJson(`${base}/Languages/zh-cn.json`, fetcher, signal);
        data = {
          ...data,
          Name: text(localized.Name, text(data.Name, repo)),
          Description: text(localized.Description, text(data.Description, '')),
        };
      } catch {
        /* Optional localization must never hide an otherwise valid plugin. */
      }
      return {
        entry,
        owner,
        repo,
        version,
        name: text(data.Name, repo),
        description: text(data.Description, '该插件暂未提供说明，可前往源码仓库了解。'),
        author: text(data.Author, owner),
        category: pluginCategory(repo),
        official: owner.toLowerCase() === 'stranslate',
        iconUrl: `${base}/icon.png`,
        website: `https://github.com/${owner}/${repo}`,
        downloadUrl: `https://github.com/${owner}/${repo}/releases/download/v${version}/${repo}.spkg`,
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('无法获取插件信息');
}
export function filterPlugins(plugins: Plugin[], query: string, category: string): Plugin[] {
  const normalized = query.trim().toLocaleLowerCase();
  return plugins.filter(
    (plugin) =>
      (category === 'All' || plugin.category === category) &&
      (!normalized ||
        [plugin.name, plugin.description, plugin.author, plugin.owner].some((value) =>
          value.toLocaleLowerCase().includes(normalized),
        )),
  );
}
