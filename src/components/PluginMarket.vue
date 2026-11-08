<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { loadPlugin, filterPlugins, type Plugin } from '../lib/plugins';
const props = defineProps<{ repos: string[] }>();
const plugins = ref<Plugin[]>([]);
const failures = ref<string[]>([]);
const pending = ref(0);
const started = ref(false);
const query = ref('');
const category = ref('All');
const brokenIcons = ref(new Set<string>());
const controller = new AbortController();
const categories = [
  { key: 'All', label: '全部插件' },
  { key: 'Translate', label: '翻译' },
  { key: 'Ocr', label: 'OCR' },
  { key: 'Tts', label: 'TTS' },
  { key: 'Vocabulary', label: '生词本' },
];
const labels: Record<string, string> = {
  Translate: '翻译',
  Ocr: 'OCR',
  Tts: 'TTS',
  Vocabulary: '生词本',
  Other: '扩展',
};
const ordered = computed(() =>
  [...plugins.value].sort((a, b) => props.repos.indexOf(a.entry) - props.repos.indexOf(b.entry)),
);
const filtered = computed(() => filterPlugins(ordered.value, query.value, category.value));
const loading = computed(() => !started.value || pending.value > 0);
function count(key: string) {
  return key === 'All'
    ? plugins.value.length
    : plugins.value.filter((plugin) => plugin.category === key).length;
}
async function load(entries: string[]) {
  if (pending.value > 0) return;
  started.value = true;
  failures.value = failures.value.filter((entry) => !entries.includes(entry));
  pending.value = entries.length;
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, entries.length) }, async () => {
      while (cursor < entries.length && !controller.signal.aborted) {
        const entry = entries[cursor++];
        try {
          const plugin = await loadPlugin(entry, controller.signal);
          if (!controller.signal.aborted)
            plugins.value = [...plugins.value.filter((p) => p.entry !== entry), plugin];
        } catch {
          if (!controller.signal.aborted) failures.value.push(entry);
        } finally {
          pending.value--;
        }
      }
    }),
  );
}
function markBroken(entry: string) {
  brokenIcons.value = new Set([...brokenIcons.value, entry]);
}
function reset() {
  query.value = '';
  category.value = 'All';
}
onMounted(() => {
  const params = new URLSearchParams(location.search);
  query.value = params.get('q') || '';
  if (categories.some((item) => item.key === params.get('category')))
    category.value = params.get('category')!;
  void load(props.repos);
});
onUnmounted(() => controller.abort());
</script>

<template>
  <div class="market-app">
    <div class="market-toolbar">
      <label class="market-search"
        ><svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="7" />
          <path d="m15 15 6 6" /></svg
        ><span class="sr-only">搜索插件名称、描述或作者</span
        ><input v-model="query" type="search" placeholder="搜索名称、描述或作者…" /><kbd
          >/</kbd
        ></label
      >
      <span class="market-total"
        >{{ repos.length }} 个已收录仓库<span aria-hidden="true"> · </span>持续生长的插件生态</span
      >
    </div>
    <div class="market-filter-row">
      <div class="category-tabs" aria-label="筛选插件分类">
        <button
          v-for="item in categories"
          :key="item.key"
          :aria-pressed="category === item.key"
          @click="category = item.key"
        >
          {{ item.label }}<span v-if="plugins.length">{{ count(item.key) }}</span>
        </button>
      </div>
      <span class="results-count" role="status">{{
        loading ? `正在加载 · 还剩 ${pending} 个` : `显示 ${filtered.length} 个插件`
      }}</span>
    </div>
    <div v-if="failures.length" class="market-notice" role="status">
      <div>
        <strong>{{
          plugins.length ? `${failures.length} 个插件暂时无法获取` : '暂时无法连接插件仓库'
        }}</strong>
        <p>其他插件仍可正常使用。请检查网络后重试，或直接前往 GitHub。</p>
      </div>
      <button class="button secondary small" :disabled="loading" @click="load([...failures])">
        {{ loading ? '加载中…' : '重试失败项' }}
      </button>
    </div>
    <div class="plugins-grid" :aria-busy="loading">
      <article v-for="plugin in filtered" :key="plugin.entry" class="plugin-card">
        <div class="plugin-card-top">
          <img
            v-if="!brokenIcons.has(plugin.entry)"
            :src="plugin.iconUrl"
            alt=""
            width="44"
            height="44"
            loading="lazy"
            @error="markBroken(plugin.entry)"
          /><span v-else class="plugin-fallback" aria-hidden="true">{{
            plugin.name.slice(0, 1)
          }}</span
          ><span :class="['plugin-badge', { official: plugin.official }]">{{
            plugin.official ? '官方' : '社区'
          }}</span>
        </div>
        <h2>{{ plugin.name }}</h2>
        <p class="plugin-author">{{ plugin.author }}</p>
        <p class="plugin-description">{{ plugin.description }}</p>
        <div class="plugin-tags">
          <span>{{ labels[plugin.category] }}</span
          ><span>v{{ plugin.version }}</span>
        </div>
        <div class="plugin-card-actions">
          <a
            :href="plugin.website"
            target="_blank"
            rel="noreferrer"
            :aria-label="`查看 ${plugin.name} 源码`"
            >查看源码<svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M7 7h10v10" /></svg></a
          ><a class="plugin-download" :href="plugin.downloadUrl" :aria-label="`下载 ${plugin.name}`"
            ><svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4" /></svg
            >下载</a
          >
        </div>
      </article>
      <template v-if="loading"
        ><div
          v-for="i in Math.min(pending || 3, 3)"
          :key="`skeleton-${i}`"
          class="plugin-card skeleton-card"
          aria-hidden="true"
        >
          <div class="skeleton sk-icon"></div>
          <div class="skeleton sk-title"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-line"></div>
          <div class="skeleton sk-short"></div></div
      ></template>
    </div>
    <div v-if="!loading && !filtered.length" class="market-empty">
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.4"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="7" />
        <path d="m15 15 6 6" />
      </svg>
      <h2>{{ plugins.length ? '没有找到匹配的插件' : '插件信息暂时无法加载' }}</h2>
      <p>
        {{
          plugins.length
            ? '换个关键词，或者查看其他分类。'
            : '插件由 GitHub 提供，请检查网络连接后重试。'
        }}
      </p>
      <button v-if="plugins.length" class="button secondary small" @click="reset">
        清除筛选条件</button
      ><a
        v-else
        class="text-link"
        href="https://github.com/STranslate"
        target="_blank"
        rel="noreferrer"
        >前往 GitHub 组织</a
      >
    </div>
    <details v-if="failures.length" class="failed-repos">
      <summary>查看暂未加载的仓库</summary>
      <ul>
        <li v-for="entry in failures" :key="entry">
          <a
            :href="`https://github.com/${entry.includes('/') ? entry : `STranslate/${entry}`}`"
            target="_blank"
            rel="noreferrer"
            >{{ entry }}</a
          >
        </li>
      </ul>
    </details>
  </div>
</template>
