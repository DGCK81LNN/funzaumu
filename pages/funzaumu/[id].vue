<template>
  <h1>{{ title }}</h1>
  <BTable :fields="fields" :items="data?.fields" />
</template>

<script setup lang="ts">
import type { TableFieldRaw } from "bootstrap-vue-next"

const route = useRoute()
const { data } = await useFetch(`/api/funzaumu/${route.params.id}`)

const fields: TableFieldRaw<(typeof data.value & {})["fields"][0]>[] = [
  {
    key: "label",
    label: "属性 Property",
    tdAttr: (_v, _k, item) => ({ title: item.comment }),
  },
  {
    key: "value",
    label: "值 Value",
    tdAttr: (v, _k, item) => {
      if (item.type_info?.options) {
        const option = item.type_info.options.find((o) => o.value === v)
        if (option) return { title: option.value }
      }
      return {}
    },
    formatter: (v, _k, item) => {
      if (item.type_info?.options) {
        const option = item.type_info.options.find((o) => o.value === v)
        if (option) return option.label
      }
      return v as string
    },
  },
  {
    key: "timestamp",
    label: "最近修改于 Last modified at",
    formatter: (v) => new Date((v as number) * 1000).toLocaleString(),
  },
]

function field(name: string) {
  return data.value?.fields.find((f) => f.name == name)?.value
}

const title = computed(() =>
  [
    field("code"),
    field("name") || field("han") || field("chat") || "未命名字母",
  ]
    .filter(Boolean)
    .join(" "),
)
useHead({ title })
</script>
