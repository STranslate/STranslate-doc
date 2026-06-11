export const META_URL = "https://stranslate.zggsong.com";
export const META_TITLE = "STranslate";
export const META_DESCRIPTION =
  "WPF 开发的一款即开即用、即用即走的翻译(OCR)工具";

export const zh = {
  description: META_DESCRIPTION,
  themeConfig: {
    nav: [
      // { text: "🛠️ DeerAPI", link: "/promotion" },
      { text: "首页", link: "/" },
      { text: "插件市场", link: "/plugins" },
      { text: "使用说明", link: "/docs/" },
    ],
    sidebar: {
      "/docs/": [
        {
          text: "主要内容",
          link: "/docs/",
          items: [
            {
              text: "插件开发",
              link: "https://github.com/STranslate/STranslate/blob/main/src/docs/community-plugin-development.md",
            },
            { text: "集成调用", link: "/docs/invoke" },
            { text: "安装卸载", link: "/docs/(un)install" },
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
