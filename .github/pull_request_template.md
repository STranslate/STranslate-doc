## 变更内容

- [ ] 新增插件收录
- [ ] 更新已有插件信息
- [ ] 文档或其他调整

## 插件信息

- 插件仓库：
- 插件名称：
- 插件类型（Translate / Ocr / Tts / Vocabulary）：
- Release Tag（必须以 `v` 开头，例如 `v1.0.0`）：
- Release Asset（`.spkg` 文件名需与仓库名一致）：

## 提交确认

### 1. 插件仓库目录结构

是否按照 STranslate 官方组织插件仓库一致的目录结构提交？

- [ ] 是
- [ ] 否，差异说明：

参考结构：

```text
RepoName/
├── RepoName/
│   ├── plugin.json
│   ├── icon.png
│   ├── Languages/
│   │   └── zh-cn.json
│   └── ...
└── ...
```

说明：插件市场会从 `RepoName/RepoName/plugin.json` 读取插件元数据，并从 `RepoName/RepoName/icon.png` 读取插件图标。

### 2. PluginID

`plugin.json` 中的 `PluginID` 是否使用新生成的 GUID，避免与现有插件 ID 冲突？

- [ ] 是
- [ ] 否，原因：

`PluginID`：

### 3. 运行截图

请提供该插件在 STranslate 中正常运行的截图。

截图：

## 其他说明

