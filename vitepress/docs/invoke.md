---
title: STranslate
titleTemplate: 集成调用
---

# 集成调用

> 类似于`有道翻译官`桌面软件的使用体验

<!-- ![snipdo](/img/snipdo.gif) -->

安装 `SnipDo` [点击下载](https://apps.microsoft.com/detail/9npz2tvkjvt7?hl=zh-cn&gl=CN)

## 手动创建插件

第二步填入下列内容
> 默认为 `50020` 如修改配置需更新

```shell
$encode_text = [System.Text.Encoding]::UTF8.GetBytes($PLAIN_TEXT)

curl 127.0.0.1:50020/translate -Method POST -Body $encode_text -UseBasicParsing
```

![1](/img/snipdo_1.png)

![2](/img/snipdo_2.png)

![3](/img/snipdo_3.png)

![4](/img/snipdo_4.png)


# Api调用

> `/` 与 `/translate` 相同

1. `/translate`
    - `GET`: 输入翻译
    - `POST` `$content`: 立即翻译内容
2. `/translate_force`
    - `GET`: 输入翻译
    - `POST` `$content`: 立即强制翻译内容
3. `/translate_input` `GET`: 输入翻译
4. `/translate_ocr`
    - `GET`: 截图翻译
    - `POST` `$filepath`: 识别图片文字并翻译
5. `/translate_crossword` `GET`: 划词翻译
6. `/translate_mousehook` `GET`: 打开/关闭监听鼠标划词
7. `/translate_replace` `GET`: 执行替换翻译
8. `/listenclipboard` `GET`: 打开/关闭监听剪贴板
9. `/ocr`:
    - `GET`: 截图OCR
    - `POST` `$filepath`: 识别图片文字
10. `/ocr_silence`:
    - `GET`: 静默截图OCR
    - `POST`: 静默识别图片文字并复制到剪贴板
11. `/ocr_qrcode`:
    - `GET`: 截图识别二维码
    - `POST`: 识别图片二维码
12. `/open_window` `GET`: 打开主界面
13. `/open_preference` `GET`: 打开设置界面
14. `/open_history` `GET`: 打开历史记录页面
15. `/forbiddenhotkey` `GET`: 禁用/启用全局热键

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
