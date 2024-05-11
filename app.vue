<script setup lang="ts">
const localeHead = useLocaleHead({ addSeoAttributes: true })
</script>

<template>
  <Html :lang="localeHead.htmlAttrs.lang" :dir="localeHead.htmlAttrs.dir">
    <Head>
      <template v-for="link in localeHead.link" :key="link.id">
        <Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in localeHead.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <NuxtLayout>
        <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<style>
.page-leave-active {
  transition: opacity 0.2s;
}
.page-leave-to {
  opacity: 0;
}
.page-enter-from {
  opacity: 0;
  filter: blur(1rem);
}
.page-enter-active {
  transition: opacity 0.2s, filter 0.2s;
}
</style>
