<template>
  <h1>希顶字母数据库</h1>
  <h4 lang="en">Shidinn Letter Database</h4>
  <p>*简陋*</p>
  <!--prettier-ignore-->
  <BCard class="mb-3">
    <p>此项目仍在开发中，旨在为<a href="https://wiki.xdi8.top">希顶</a>社区创造一个用以记载和更新<a href="https://wiki.xdi8.top/wiki/%E5%B8%8C%E5%90%95%E5%AD%97%E6%AF%8D">希吕字母</a>相关信息的平台。自动生成 FontForge 字体工程文件将是本项目的一项重要功能。</p>
    <p style="font-size:0.8em;">This project, still under development, aims to serve as a platform where the <a href="https://wiki.xdi8.top">Shidinn</a> community can look up and update information about the <a href="https://wiki.xdi8.top/wiki/%E5%B8%8C%E5%90%95%E5%AD%97%E6%AF%8D">Infinite Shidinn Alphabet</a>. Automatic generation of FontForge project files is an important planned feature of this project.</p>
    <p class="mb-0">— <a href="https://wiki.xdi8.top/wiki/User:DGCK81LNN">DGCK81LNN</a></p>
  </BCard>
  <h2>最近更改 Recently Changed</h2>
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

function label(item: (typeof data.value & {})[0]) {
  return [item.code, item.name || item.han || item.chat || "未命名字母"]
    .filter(Boolean)
    .join(" ")
}
</script>
