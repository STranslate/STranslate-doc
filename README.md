# STranslate 官方网站与文档

基于 Astro、TypeScript、Vue 与原生 CSS 构建的中文静态站点。包含产品首页、Markdown 使用文档和社区插件市场。

## 本地开发

使用 Node.js 24（最低 22.23.4）和 npm：

```sh
npm ci
npm run dev
```

`npm run build` 完成类型检查、静态生成、Pagefind 中文索引和站内链接检查；`npm run preview` 预览完整生产站点。开发模式首次使用搜索前，请先运行一次构建；之后开发服务器会读取生产搜索索引。编辑文档后，重新构建可以更新索引。

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## 内容维护与部署

- `src/content/docs/`：Markdown 文档。frontmatter 中的 `title`、`description`、`group`、`order` 控制页面信息和导航顺序。
- `src/data/plugins.json`：插件仓库清单，保持字符串数组格式。市场在浏览器端请求 GitHub 元数据，不需要 token 或后端。
- `src/components/`、`src/layouts/`：共享导航、搜索、文档布局和 Vue 插件市场。
- `src/styles/global.css`：深浅主题变量、响应式布局与组件样式。
- `public/img/`：产品截图；`public/media/`：实际录屏转码后的 MP4、封面和首页截图。
- `scripts/check-links.mjs`：构建后检查站内链接、标题锚点和媒体文件。文档统一使用新入口，不维护旧地址跳转。

通过 Cloudflare Pages 控制台连接 Git 仓库，并设置：

| 配置项       | 值                 |
| ------------ | ------------------ |
| 框架预设     | Astro              |
| 构建命令     | `npm run build`    |
| 构建输出目录 | `dist`             |
| 根目录       | 仓库根目录（留空） |
| 环境变量     | `NODE_VERSION=24`  |

构建命令请使用 `npm run build`，确保同时生成中文搜索索引并执行链接和文件大小检查。本站为纯静态输出，不需要 `wrangler.toml`、Pages Functions 或服务端适配器。域名在 Astro 配置中统一设置，并生成 canonical 与 sitemap。每篇文档底部的 GitHub 编辑入口指向对应 Markdown 文件。

视频使用显式播放控件、`preload="none"` 和静态封面。原始 GIF 不参与网站运行或构建，已从当前目录移除，必要时可从 Git 历史取回。更新录屏时，同步更新同名 MP4/WebP 并核对内容适用的软件版本。构建检查所有发布文件不得超过 Cloudflare Pages 的 25 MiB 单文件上限。详细媒体来源见 `.impeccable/media-manifest.md`。

## 提交插件

欢迎提交您的插件到 STranslate 插件市场！请遵循以下步骤：

### 1. 准备插件仓库

确保您的插件托管在公开的 GitHub 仓库中，并符合以下目录结构：

> 正常使用只需要从 [STranslate Org](https://github.com/STranslate) 复制一个同类型的项目修改元数据
>
> - `plugin.json` 里的 `PluginID`, `ExecuteFileName`, `Version` 一定要结合实际情况更新
> - 其他根据插件自身情况考虑更新即可

```text
RepoName/ (仓库根目录)
├── RepoName/ (项目目录，需与仓库名一致)
│   ├── plugin.json  (插件元数据)
│   ├── icon.png     (插件图标)
│   └── ...
└── ...
```

### 2. 规范发布 (Release)

在 GitHub 发布 Release 时，请务必遵守以下规范，否则插件市场无法正确识别下载链接：

> 正常使用组织下仓库 Copy 修改只需要打 Tag (必须以 `v` 开头, 比如 `v1.0.0`)并推送到远端即可触发 `Github Actions` 自动打包发布

- **Tag 版本号**：必须以 `v` 开头，例如 `v1.0.0`。
- **构建产物**：请上传打包好的 `.spkg` 文件到 Release Assets 中。
- **文件名**：`.spkg` 文件名必须与仓库名一致（例如 `STranslate.Plugin.Demo.spkg`）。

### 3. 提交收录

1.  Fork 本仓库。
2.  编辑 `src/data/plugins.json` 文件。
3.  在数组中添加您的仓库路径，格式为 `"用户名/仓库名"`。
    ```json
    ["STranslate.Plugin.Translate.DeepLX", "YourName/YourRepoName"]
    ```
4.  提交 Pull Request。

等待审核通过后，您的插件将自动出现在插件市场中。
