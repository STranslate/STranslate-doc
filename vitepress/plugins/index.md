---
layout: page
---

<script setup>
import PluginMarket from '../components/PluginMarket.vue'
import plugins from './plugins.json'
</script>

<div class="market-page">

# 插件市场

在这里你可以发现由社区贡献的各种翻译/OCR/TTS/生词本 服务插件。

<PluginMarket :repos="plugins" />

## 如何安装

1. 点击上方卡片中的 **下载** 按钮获取 `.spkg` 文件。
2. 打开 STranslate 软件，进入 **设置 > 插件**。
3. 将下载的文件拖入窗口即可安装。

</div>

<style>
.market-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* 标题样式适配 */
.market-page h1 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
  background: -webkit-linear-gradient(315deg, var(--vp-c-brand) 25%, var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.market-page h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 48px 0 24px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.market-page p {
  font-size: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 16px;
}

/* 列表样式适配 */
.market-page ol {
  padding-left: 20px;
  margin-bottom: 24px;
  color: var(--vp-c-text-2);
}

.market-page li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.market-page strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .market-page {
    padding: 24px 20px;
  }
  
  .market-page h1 {
    font-size: 28px;
  }
}
</style>