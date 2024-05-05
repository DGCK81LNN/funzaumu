<template>
  <h1>希顶字母数据库</h1>
  <p>*简陋*</p>
  <p><br /></p>
  <h2>最经更改</h2>
  <BTableSimple>
    <BThead>
      <BTr>
        <BTh>字母 Letter</BTh>
        <BTh>最近修改于 Last modified at</BTh>
      </BTr>
    </BThead>
    <BTbody>
      <BTr v-for="funzaumu in data">
        <BTd>
          <NuxtLink :to="`/funzaumu/${funzaumu.id}`">
            {{ label(funzaumu) }}
          </NuxtLink>
        </BTd>
        <BTd>{{ new Date(funzaumu.timestamp * 1000).toLocaleString() }}</BTd>
      </BTr>
    </BTbody>
  </BTableSimple>
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/recent")

console.log(data.value)

function label(item: (typeof data.value & {})[0]) {
  return [item.code, item.name || item.han || item.chat || "未命名字母"]
    .filter(Boolean)
    .join(" ")
}
</script>
