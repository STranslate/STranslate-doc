---
title: 图片翻译与 OCR
description: 从截图和图片中提取文字，在原图位置阅读译文。
group: 功能指南
order: 4
---

## 配置识别服务

图片翻译需要同时启用 OCR 服务和文本翻译页面中的图片翻译服务。内置微信 OCR 引擎可以离线识别文字，其他识别服务可通过插件扩展。

## 图片翻译

1. 配置图片翻译服务
2. 配置文本识别服务

<figure class="demo-media"><video controls preload="none" playsinline poster="/media/image_trans.webp" aria-label="图片翻译操作演示"><source src="/media/image_trans.mp4" type="video/mp4" /><a href="/media/image_trans.mp4">直接打开操作视频</a></video><figcaption>图片翻译 · 软件实际操作演示</figcaption></figure>

## 图片翻译（精简窗口）

1. 设置-独立窗口-图片翻译窗口模式-精简窗口

<figure class="demo-media"><video controls preload="none" playsinline poster="/media/image_trans_sim.webp" aria-label="图片翻译（精简窗口）操作演示"><source src="/media/image_trans_sim.mp4" type="video/mp4" /><a href="/media/image_trans_sim.mp4">直接打开操作视频</a></video><figcaption>图片翻译（精简窗口） · 软件实际操作演示</figcaption></figure>

## 更多识别操作

通过快捷键或集成接口可以调用截图 OCR、静默 OCR 与二维码识别。静默 OCR 会将识别结果复制到剪贴板。接口列表见 [集成调用](/docs/invoke/#api调用)。
