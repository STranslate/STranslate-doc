<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  repos: {
    type: Array,
    default: () => []
  }
})

const GITHUB_ORG = 'STranslate'

const allPlugins = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('All')

const TABS = [
  { key: 'All', label: '全部' },
  { key: 'Translate', label: '翻译' },
  { key: 'Ocr', label: 'OCR' },
  { key: 'Tts', label: 'TTS' },
  { key: 'Vocabulary', label: '生词本' }
]

// 默认图标 Base64 (SVG)
const defaultIcon = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2256%22 height=%2256%22><rect width=%2256%22 height=%2256%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2224%22 fill=%22%23cbd5e1%22>📦</text></svg>"

const filteredPlugins = computed(() => {
  let result = allPlugins.value

  // Filter by category
  if (selectedCategory.value !== 'All') {
    result = result.filter(p => p.type === selectedCategory.value)
  }

  const query = searchQuery.value.toLowerCase()
  if (!query) return result
  
  return result.filter(plugin => 
    plugin.Name.toLowerCase().includes(query) ||
    plugin.Description.toLowerCase().includes(query) ||
    plugin.Author.toLowerCase().includes(query)
  )
})

async function fetchPluginInfo(repoName) {
  try {
    const pluginJsonUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${repoName}/main/${repoName}/plugin.json`
    const pluginJsonRes = await fetch(pluginJsonUrl)
    const pluginInfo = await pluginJsonRes.json()

    // 简单的版本号获取，实际生产建议加缓存或错误处理
    // const releaseUrl = `https://api.github.com/repos/${GITHUB_ORG}/${repoName}/releases/latest`
    // const releaseRes = await fetch(releaseUrl)
    // const releaseInfo = await releaseRes.json()

    const downloadUrl = `https://github.com/${GITHUB_ORG}/${repoName}/releases/download/${pluginInfo.Version}/${repoName}.spkg`
    const iconUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${repoName}/main/${repoName}/icon.png`

    return {
      ...pluginInfo,
      repoName,
      downloadUrl,
      iconUrl,
      Website: `https://github.com/${GITHUB_ORG}/${repoName}`,
      type: repoName.split('.')[2]
    }
  } catch (error) {
    console.error(`Failed to fetch ${repoName}:`, error)
    return null
  }
}

function handleImageError(e) {
  e.target.src = defaultIcon
}

function downloadPlugin(url) {
  window.location.href = url
}

onMounted(async () => {
  loading.value = true
  const plugins = await Promise.all(
    props.repos.map(repo => fetchPluginInfo(repo))
  )
  allPlugins.value = plugins.filter(p => p !== null)
  loading.value = false
})
</script>

<template>
  <div class="market-container">
    <div class="search-wrapper">
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜索插件 (名称、描述、作者)..."
        class="search-input"
      >
    </div>

    <div class="category-tabs">
      <button 
        v-for="tab in TABS" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: selectedCategory === tab.key }"
        @click="selectedCategory = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="plugins-grid">
      <div v-for="i in 6" :key="i" class="plugin-card skeleton-card">
        <div class="card-header">
          <div class="skeleton skeleton-icon"></div>
          <div class="header-content">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-author"></div>
          </div>
        </div>
        <div class="skeleton skeleton-desc"></div>
        <div class="skeleton skeleton-desc w-75"></div>
        <div class="card-footer">
          <div class="skeleton skeleton-btn"></div>
        </div>
      </div>
    </div>

    <!-- Plugin List -->
    <div v-else-if="filteredPlugins.length > 0" class="plugins-grid">
      <div v-for="plugin in filteredPlugins" :key="plugin.repoName" class="plugin-card">
        <div class="card-header">
          <img :src="plugin.iconUrl" :alt="plugin.Name" class="plugin-icon" @error="handleImageError">
          <div class="header-content">
            <h3 class="plugin-title">{{ plugin.Name }}</h3>
            <div class="plugin-meta">
              <span class="author">@{{ plugin.Author }}</span>
              <span class="version">v{{ plugin.Version }}</span>
            </div>
          </div>
        </div>
        
        <p class="plugin-description" :title="plugin.Description">{{ plugin.Description }}</p>
        
        <div class="card-footer">
          <a :href="plugin.Website" target="_blank" class="action-btn secondary" title="查看源码">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <button class="action-btn primary" @click="downloadPlugin(plugin.downloadUrl)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            下载
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>没有找到匹配的插件</p>
    </div>
  </div>
</template>

<style scoped>
.market-container {
  margin: 2rem 0;
}

/* Search */
.search-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-2);
  pointer-events: none;
  display: flex;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-dimm);
  outline: none;
}

/* Tabs */
.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tab-item {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.tab-item:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.tab-item.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

/* Grid */
.plugins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Card */
.plugin-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plugin-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.plugin-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.header-content {
  flex: 1;
  min-width: 0;
}

.plugin-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.plugin-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.version {
  background: var(--vp-c-bg);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
}

.plugin-description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer & Actions */
.card-footer {
  margin-top: auto;
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: var(--vp-c-brand);
  color: white;
  flex: 1;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.action-btn.primary:hover {
  background-color: var(--vp-c-brand-2); /* Use standard vitepress var */
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.3);
}

.action-btn.primary:active {
  transform: translateY(1px) scale(0.98);
  filter: brightness(0.9);
  box-shadow: none;
}

.action-btn.secondary {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
  padding: 0.5rem;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.action-btn.secondary:hover {
  border-color: var(--vp-c-text-2);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  transform: translateY(-1px);
}

.action-btn.secondary:active {
  transform: translateY(1px) scale(0.95);
  background: var(--vp-c-bg-mute);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-bg) 50%, var(--vp-c-bg-alt) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-card { pointer-events: none; }
.skeleton-icon { width: 48px; height: 48px; border-radius: 10px; }
.skeleton-title { height: 20px; width: 60%; margin-bottom: 8px; }
.skeleton-author { height: 14px; width: 40%; }
.skeleton-desc { height: 14px; width: 100%; margin-bottom: 8px; }
.w-75 { width: 75%; }
.skeleton-btn { height: 36px; width: 100%; border-radius: 6px; margin-top: auto; }
</style>