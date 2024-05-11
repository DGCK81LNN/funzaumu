// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@bootstrap-vue-next/nuxt", "@nuxtjs/i18n", "@nuxtjs/color-mode"],
  dev: true,
  //devtools: { enabled: true },
  app: {
    head: {
      meta: [{ name: "format-detection", content: "telephone=no" }],
      link: [
        {
          rel: "stylesheet",
          href: "https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-lnn.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-vue-3-lnn.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
        },
      ],
    },
  },
  i18n: {
    strategy: "no_prefix",
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
      },
      {
        code: "cmn-Hans",
        iso: "zh-cmn-Hans",
        name: "简体中文",
        isCatchallLocale: true,
      },
    ],
    defaultLocale: "cmn-Hans",
    baseUrl: "https://funzaumu.vudrux.site",
  },
  colorMode: {
    dataValue: "bs-theme",
  },
})
