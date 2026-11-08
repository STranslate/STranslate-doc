---
title: 集成调用
description: 通过 SnipDo 与本地 HTTP 接口，将 STranslate 接入其他工具。
group: 扩展与集成
order: 7
---

> 类似于`有道翻译官`桌面软件的使用体验

安装 `SnipDo` [点击下载](https://apps.microsoft.com/detail/9npz2tvkjvt7?hl=zh-cn&gl=CN)

## 手动创建插件

第二步填入下列内容

> 默认为 `50020` 如修改配置需更新

```shell
$encode_text = [System.Text.Encoding]::UTF8.GetBytes($PLAIN_TEXT)

curl 127.0.0.1:50020/translate -Method POST -Body $encode_text -UseBasicParsing
```

![SnipDo 配置步骤 1](/img/snipdo_1.png)

![SnipDo 配置步骤 2](/img/snipdo_2.png)

![SnipDo 配置步骤 3](/img/snipdo_3.png)

![SnipDo 配置步骤 4](/img/snipdo_4.png)

## API调用

> `/` 与 `/translate` 相同

- `/translate`
  - `GET`: 输入翻译
  - `POST` `$content`: 立即翻译内容
- `/translate_force`
  - `GET`: 输入翻译
  - `POST` `$content`: 立即强制翻译内容
- `/translate_input` `GET`: 输入翻译
- `/translate_ocr`
  - `GET`: 截图翻译
  - `POST` `$filepath`: 识别图片文本并在主窗口上进行翻译
- `/translate_ocr_image`
  - `GET`: 图片翻译
  - `POST` `$filepath`: 识别图片文本并在图片上直接翻译
- `/translate_crossword` `GET`: 划词翻译
- `/translate_mousehook` `GET`: 打开/关闭监听鼠标划词
- `/translate_replace` `GET`: 对选中文本执行替换翻译
- `/ocr`:
  - `GET`: 截图OCR
  - `POST` `$filepath`: 识别图片文字
- `/ocr_silence`:
  - `GET`: 静默截图OCR
  - `POST` `$filepath`: 静默识别图片文字并复制到剪贴板
- `/ocr_qrcode`:
  - `GET`: 截图识别二维码
  - `POST` `$filepath`: 识别图片二维码
- `/open_window` `GET`: 打开主界面
- `/open_preference` `GET`: 打开设置界面
- `/open_history` `GET`: 打开历史记录页面
- `/forbiddenhotkey` `GET`: 禁用/启用全局热键
- `/tts_silence`:
  - `GET`: 静默朗读选中文本
  - `POST` `$content`: 静默朗读内容

翻译示例:

```shell
#参数为要翻译的内容
curl http://127.0.0.1:50020/translate -d "你好世界"
```

OCR示例:

```shell
#参数为文件路径
curl http://127.0.0.1:50020/ocr -d "D:\\tmp\\stranslate.png"
```
