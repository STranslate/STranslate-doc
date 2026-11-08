---
title: 安装与管理插件
description: 通过 .spkg 插件扩展翻译、OCR、语音和生词本服务。
group: 扩展与集成
order: 6
---

## 找到需要的服务

在 [插件市场](/plugins/) 中按分类浏览，或通过名称、描述和作者搜索插件。市场涵盖翻译、OCR、TTS 与生词本服务，包含官方维护和社区贡献的插件。

## 安装插件

1. 点击插件的「下载」按钮，从 GitHub 获取 `.spkg` 文件。
2. 打开 STranslate 的 **设置 → 插件** 页面。
3. 将下载的文件拖入窗口，或者点击安装按钮加载文件。两种方式均支持安装多个插件。
4. 根据插件要求配置对应服务。

<figure class="demo-media"><video controls preload="none" playsinline poster="/media/install_plugin.webp" aria-label="拖入 spkg 文件安装插件的操作演示"><source src="/media/install_plugin.mp4" type="video/mp4" /><a href="/media/install_plugin.mp4">直接打开操作视频</a></video><figcaption>将 .spkg 文件拖入插件页面即可安装。</figcaption></figure>

## 遇到下载问题

插件直接通过 GitHub Releases 提供。如果下载失败，可以打开插件的源码仓库，从 Releases 页面查找对应版本的 `.spkg` 文件。

## 开发与贡献

插件系统基于 .NET。开发方式见 [社区插件开发指南](https://github.com/STranslate/STranslate/blob/main/src/docs/community-plugin-development.md)。

要将插件提交到市场，请阅读 [网站仓库中的贡献说明](https://github.com/STranslate/STranslate-doc#提交插件)。现有收录流程通过 Pull Request 审核，并检查新增插件的 PluginID 是否与其他插件冲突。
