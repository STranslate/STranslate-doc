export const META_URL = "https://stranslate.zggsong.com";
export const META_TITLE = "STranslate";
export const META_DESCRIPTION =
  "WPF 开发的一款即开即用、即用即走的翻译(OCR)工具";

export const zh = {
  description: META_DESCRIPTION,
  themeConfig: {
    nav: [
      { text: "🛠️ DeerAPI", link: "/promotion" },
      { text: "首页", link: "/" },
      { text: "插件", link: "/plugins/" },
      { text: "使用说明", link: "/docs/" },
    ],
    sidebar: {
      "/docs/": [
        {
          text: "主要内容",
          link: "/docs/",
          items: [
            { text: "插件系统", link: "/docs/plugin" },
            { text: "集成调用", link: "/docs/invoke" },
            { text: "安装卸载", link: "/docs/(un)install" },
            // {
            //   text: "软件配置",
            //   collapsed: true,
            //   items: [
            //     { text: "常规设置", link: "/docs/config/common" },
            //     { text: "热键设置", link: "/docs/config/hotkey" },
            //     { text: "翻译服务", link: "/docs/config/translate" },
            //     { text: "替换翻译", link: "/docs/config/replace" },
            //     { text: "OCR服务", link: "/docs/config/ocr" },
            //     { text: "语音服务", link: "/docs/config/tts" },
            //     { text: "历史记录", link: "/docs/config/history" },
            //     { text: "导入导出", link: "/docs/config/backup" },
            //     { text: "关于软件", link: "/docs/config/about" },
            //   ],
            // },
            { text: "FAQ", link: "/docs/faq" },
          ],
        },
      ],
    },
    footer: {
      copyright: "Copyright © 2024-present ZGGSONG",
    },
    editLink: {
      pattern:
        "https://github.com/STranslate/STranslate-doc/edit/main/vitepress/:path",
      text: "在 GitHub 上编辑此页面",
    },
  },
};
