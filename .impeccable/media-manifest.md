# Real product media

All assets come from the repository’s existing STranslate recordings in `assets/recordings/`. The original GIFs remain unchanged. No generated art is used: the homepage’s product proof depends on authentic software UI and recorded translation results. Cropping, proportional resizing and compression do not replace or invent UI text.

## Homepage stills

| Output | Source / extraction | Dimensions | Bytes | Accessible title |
| --- | --- | --- | ---: | --- |
| `public/media/hero-translation.webp` | `trans_back.gif` at 12.00 s; crop `824:676:625:58` (width:height:x:y), native size; WebP quality 92 | 824 × 676 | 21,172 | STranslate 浮窗将 hello world 翻译为你好，世界，并显示回译结果 |
| `public/media/ocr-preview.webp` | `image_trans_sim.gif` at 4.00 s; crop `1510:675:270:0`, resize width to 1280; WebP quality 90 | 1280 × 572 | 90,618 | STranslate 截图翻译将英文阅读区域替换为中文，底部显示 OCR 与翻译工具栏 |

The hero is a detail crop of the real window through the first completed provider card, suited to approximately 390 × 320 CSS pixels. Other providers continue below the crop. The OCR preview preserves the recording’s actual text-replacement rendering, including faint underlying English text. Neither still contains a loading overlay or file dialog.

## Operation videos and posters

Each row maps `assets/recordings/<name>.gif` to `public/media/<name>.mp4` and a same-name `.webp` poster. Videos preserve the full recorded scene and duration (rounding to the nearest 15 fps frame). Encoding: H.264/libx264, CRF 25, medium preset, 15 fps, `yuv420p`, no audio, `+faststart`; proportional width capped at 1440 with even dimensions. Posters preserve the same full scene at the video dimensions, WebP quality 86. Poster times were visually selected to show useful software state without a loading overlay. Use explicit controls and `preload="none"`; no autoplay is needed.

| Name | Accessible title | Dimensions | Duration | MP4 bytes | Poster time | Poster bytes |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `fontsize` | 调整翻译浮窗字体大小 | 1440 × 1050 | 15.600 s | 873,085 | 6.00 s | 52,766 |
| `image_trans` | 配置并使用图片翻译窗口 | 1440 × 1050 | 18.467 s | 559,839 | 17.00 s | 18,416 |
| `image_trans_sim` | 截图识别与原位图片翻译 | 1440 × 1124 | 19.600 s | 894,789 | 4.00 s | 159,946 |
| `incremental_translation` | 选中文字后追加翻译内容 | 1440 × 826 | 29.533 s | 819,472 | 26.00 s | 116,922 |
| `install_plugin` | 安装插件并添加翻译服务 | 1440 × 812 | 27.333 s | 900,637 | 26.00 s | 50,090 |
| `snipdo` | 配置 SnipDo 并调用 STranslate 翻译选中文本 | 1364 × 924 | 52.467 s | 1,308,347 | 46.00 s | 81,354 |
| `trans_back` | 开启自动回译并对照翻译结果 | 1440 × 1050 | 20.200 s | 660,650 | 18.00 s | 50,576 |
| `trans_mode` | 切换翻译服务的执行模式 | 1440 × 1050 | 29.533 s | 867,543 | 13.00 s | 54,552 |
| `update_icon` | 更换翻译服务图标（当前版本操作） | 1440 × 1124 | 11.067 s | 551,709 | 10.00 s | 44,032 |
| `update_svc_name` | 修改翻译服务显示名称 | 1440 × 1050 | 10.467 s | 327,312 | 9.00 s | 51,358 |

## Verification

All ten MP4s successfully decoded with FFmpeg. FFprobe confirmed H.264, `yuv420p`, 15 fps, even dimensions and width at most 1440. Each MP4’s `moov` atom precedes `mdat` (faststart). All ten posters and both homepage stills were visually inspected. Poster extraction uses output-side seeking (`-i source.gif -ss time`) because input-side GIF seeking can return an earlier frame.

Original GIFs are archived in `assets/recordings/` and excluded from static deployment. Production tutorial fallbacks point directly to the MP4. Build checks enforce Cloudflare Pages’ 25 MiB asset limit.
