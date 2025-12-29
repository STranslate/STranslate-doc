## 提交插件

欢迎提交您的插件到 STranslate 插件市场！请遵循以下步骤：

### 1. 准备插件仓库

确保您的插件托管在公开的 GitHub 仓库中，并符合以下目录结构：
> 正常使用只需要从 [STranslate Org](https://github.com/STranslate) 复制一个同类型的项目修改元数据
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

*   **Tag 版本号**：必须以 `v` 开头，例如 `v1.0.0`。
*   **构建产物**：请上传打包好的 `.spkg` 文件到 Release Assets 中。
*   **文件名**：`.spkg` 文件名必须与仓库名一致（例如 `STranslate.Plugin.Demo.spkg`）。

### 3. 提交收录

1.  Fork 本仓库。
2.  编辑 `vitepress/plugins.json` 文件。
3.  在数组中添加您的仓库路径，格式为 `"用户名/仓库名"`。
    ```json
    [
      "STranslate.Plugin.Translate.DeepLX",
      "YourName/YourRepoName" 
    ]
    ```
4.  提交 Pull Request。

等待审核通过后，您的插件将自动出现在插件市场中。
