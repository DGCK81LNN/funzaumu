// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@bootstrap-vue-next/nuxt"],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-cmn-Hans",
      },
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
      ],
    },
  },
  ssr: true,
})
