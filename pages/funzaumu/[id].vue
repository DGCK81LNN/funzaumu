<script setup lang="ts">
import type { TableFieldRaw } from "bootstrap-vue-next"

const route = useRoute()
const { t, d } = useI18n({ useScope: "local" })
const { data } = await useFetch(`/api/funzaumu/${route.params.id}`)

const fields = computed<TableFieldRaw<(typeof data.value & {})["fields"][0]>[]>(
  () => [
    {
      key: "label",
      label: t("property"),
      tdAttr: (_v, _k, item) => ({ title: item.comment }),
    },
    {
      key: "value",
      label: t("value"),
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
      label: t("last-modified"),
      formatter: (v) => d((v as number) * 1000, "datetime"),
    },
  ],
)

function field(name: string) {
  return data.value?.fields.find((f) => f.name == name)?.value
}

const title = computed(() =>
  [
    field("code"),
    field("name") || field("han") || field("chat") || t("unnamed-letter"),
  ]
    .filter(Boolean)
    .join(" "),
)
useHead({ title })
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <BTable :fields="fields" :items="data?.fields" />
  </div>
</template>

<i18n lang="yaml">
cmn-Hans:
  property: 属性
  value: 值
  last-modified: 最近修改于
  unnamed-letter: 未命名字母
en:
  property: Property
  value: Value
  last-modified: Last modified
  unnamed-letter: Unnamed letter
</i18n>
