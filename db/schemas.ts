import type { JSONSchema, FromSchema } from "json-schema-to-ts"

export const unicodeApproxSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      value: {
        title: "字符 Character",
        type: "string",
      },
      category: {
        title: "类型 Type",
        anyOf: [
          {
            title: "大写 Upper case",
            const: "upper",
          },
          {
            title: "小写 Lower case",
            const: "lower",
          },
          {
            title: "汉写 Hanzi case",
            const: "han",
          },
        ],
      },
      tags: {
        title: "标签 Tags",
        type: "array",
        items: {
          type: "string",
          examples: ["rtl", "hebrew"],
        },
        uniqueItems: true,
      },
    },
    required: ["value", "category"],
    additionalProperties: false,
  },
} as const satisfies JSONSchema

export type UnicodeApprox = FromSchema<typeof unicodeApproxSchema>
