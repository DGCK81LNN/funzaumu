import { toBb26 } from "bb26"
import type { Knex } from "knex"
import type { PartialModelObject } from "objection"
import { Field } from "../models.js"
import { unicodeApproxSchema } from "../schemas.js"

function hex(n: number) {
  return n.toString(16).toUpperCase().padStart(2, "0")
}

export async function seed(knex: Knex): Promise<void> {
  const blockNames = [
    "基本 Basic",
    "扩展推荐集 Recommended Extension Set",
    "扩展兼容集 A / Compatibility Extension Set A",
    "扩展兼容集 B / Compatibility Extension Set B",
    "附标 A / Diacritical A",
    "附标 B / Diacritical B",
    "希吕函子 Infinite Shidinn Functors",
    "希吕保护 Infinite Shidinn Protected",
  ]
  for (let i = 1; i <= 15; i++) {
    const letter = toBb26(i)
    blockNames.push(`希吕音字 ${letter} / Infinite Shidinn Phonemic ${letter}`)
    blockNames.push(
      `希吕意字合字 ${letter} / Infinite Shidinn Ideographic & Ligatures ${letter}`,
    )
  }

  const fields: PartialModelObject<Field>[] = [
    {
      index: 0,
      label: "基本信息 Basic Info",
      type: "label",
      type_info: {
        labelRole: "h2",
      },
    },
    {
      index: 1,
      name: "code",
      label: "编号 Code",
      comment:
        "十六进制编号，至少 2 位，不足 2 位时前补 0。不小于 (10)₁₆ 时不要有前置 0。At least 2 hexadecimal digits, pad with zeroes when less than 2 digits. Must not include leading zeroes if greater than or equal to (10)₁₆.",
      type: "mapping",
    },
    {
      index: 2,
      name: "name",
      label: "名称 Name",
      type: "notation",
    },
    {
      index: 3,
      name: "chat",
      label: "聊天字母 Chat Letter",
      type: "notation",
    },
    {
      index: 4,
      name: "han",
      label: "汉写 Hanzi case",
      comment:
        "单个 Unicode 或协调码字符（如存在） / Single Unicode character (if exists)",
      type: "notation",
    },
    {
      index: 5,
      name: "han_ids",
      label: "汉写 IDS / Hanzi case IDS",
      comment:
        '汉写未入 U 或字体支持不足的情况下，在此填写 <a href="https://www.qiuwenbaike.cn/wiki/表意文字描述字符#表意文字描述序列">IDS（表意文字描述序列）</a>。Place <a href="https://en.wikipedia.org/wiki/Chinese_character_description_languages#Ideographic_Description_Sequences">Ideographic Description Sequence</a> here if the hanzi case is not in Unicode or font support for the character is poor.',
      type: "notation",
    },
    {
      index: 10,
      label: "字形 Glyphs",
      type: "label",
      type_info: {
        labelRole: "h3",
      },
    },
    {
      index: 11,
      name: "upper_glyph",
      label: "大写字形 Upper case glyph",
      type: "glyph",
    },
    {
      index: 12,
      name: "lower_glyph",
      label: "小写字形 Lower case glyph",
      type: "glyph",
    },
    {
      index: 13,
      name: "middle_glyph",
      label: "中写字形 Middle case glyph",
      type: "glyph",
    },
    {
      index: 14,
      name: "han_glyph",
      label: "汉写字形 Hanzi case glyph",
      type: "glyph",
      type_info: { glyphCategory: "hanzi" },
    },
    {
      index: 19,
      name: "sketch",
      label: "字形示意 Glyph sketch",
      type: "glyph",
    },
    {
      index: 19.1,
      name: "img",
      label: "参考图片 Reference image",
      type: "image",
    },
    {
      index: 20,
      label: "读音 Sounds",
      type: "label",
      type_info: {
        labelRole: "h3",
      },
    },
    {
      index: 21,
      name: "reading",
      label: "呼读音 Reading",
      type: "notation",
    },
    {
      index: 22,
      name: "phonetic",
      label: "本身音 Phonetic",
      type: "notation",
    },
    {
      index: 30,
      label: "扩展信息 Extra Info",
      type: "label",
      type_info: {
        labelRole: "h2",
      },
    },
    {
      index: 31,
      name: "page",
      label: "编码页 Encoding page",
      type: "property",
      type_info: {
        options: [
          {
            value: "",
            label: "无 None",
          },
          ...blockNames.map((name, index) => ({
            value: hex(index << 6),
            label: `${hex(index << 6)}-${hex(index === 0 ? 47 : (index << 6) | 63)}. ${name}`,
          })),
        ],
      },
    },
    {
      index: 91,
      name: "comment",
      label: "注释 Comment",
      type: "text",
    },
    {
      index: 100,
      label: "扩展信息 Extra Info",
      type: "label",
      type_info: {
        labelRole: "h2",
      },
    },
    {
      index: 100.01,
      label: "第二字形 Alt glyphs",
      comment:
        "第二大、小、中、汉写与聊天字母不必全部存在，也不必严格对应。Alt upper / lower / middle / hanzi case and chat letter are not required to all exist or match each other as a distinct set.",
      type: "label",
      type_info: {
        labelRole: "h3",
      },
    },
    {
      index: 101,
      name: "alt_upper_glyph",
      label: "第二大写字形 Alt upper case glyph",
      type: "glyph",
    },
    {
      index: 102,
      name: "alt_lower_glyph",
      label: "第二小写字形 Alt lower case glyph",
      type: "glyph",
    },
    {
      index: 103,
      name: "alt_middle_glyph",
      label: "第二中写字形 Alt middle case glyph",
      type: "glyph",
    },
    {
      index: 104,
      name: "alt_han_glyph",
      label: "第二汉写字形 Alt hanzi case glyph",
      type: "glyph",
      type_info: { glyphCategory: "hanzi" },
    },
    {
      index: 107,
      name: "alt_chat",
      label: "第二聊天字母 Alt chat letter",
      type: "notation",
    },
    {
      index: 108,
      name: "alt_han",
      label: "第二汉写 Alt hanzi case",
      type: "notation",
    },
    {
      index: 108.1,
      name: "alt_han_ids",
      label: "第二汉写 IDS / Alt hanzi case IDS",
      type: "notation",
    },
    {
      index: 109,
      name: "alt_sketch",
      label: "第二字形示意 Alt glyph sketch",
      type: "glyph",
    },
    {
      index: 109.1,
      name: "alt_img",
      label: "第二字形参考图片 Alt glyph reference image",
      type: "image",
    },
    {
      index: 110,
      label: "形近替代字 Unicode Approximates",
      type: "label",
      type_info: {
        labelRole: "h3",
      },
    },
    {
      index: 111,
      name: "unicode_approx",
      label: "形近替代字 Unicode Approximates",
      type: "json",
      type_info: {
        schema: unicodeApproxSchema,
      },
    },
    {
      index: 1000,
      label: "更多字形 More Glyphs",
      type: "label",
      type_info: {
        labelRole: "h3",
      },
    },
    {
      index: 1001,
      name: "script_upper_glyph",
      label: "手写大写字形 Handwritten upper case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "handwriting" },
    },
    {
      index: 1002,
      name: "script_lower_glyph",
      label: "手写小写字形 Handwritten lower case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "handwriting" },
    },
    {
      index: 1003,
      name: "script_middle_glyph",
      label: "手写中写字形 Handwritten middle case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "handwriting" },
    },
    {
      index: 1004,
      name: "script_han_glyph",
      label: "手写汉写字形 Handwritten hanzi case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "hanzi" },
    },
    {
      index: 1011,
      name: "alt_script_upper_glyph",
      label: "第二手写大写字形 Alt handwritten upper case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "handwriting" },
    },
    {
      index: 1012,
      name: "alt_script_lower_glyph",
      label: "第二手写小写字形 Alt handwritten lower case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "handwriting" },
    },
    {
      index: 1013,
      name: "alt_script_middle_glyph",
      label: "第二手写中写字形 Alt handwritten middle case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "handwriting" },
    },
    {
      index: 1014,
      name: "alt_script_han_glyph",
      label: "第二手写汉写字形 Alt handwritten hanzi case glyph",
      type: "glyph",
      type_info: { glyphDrawingMode: "line", glyphCategory: "hanzi" },
    }
  ]

  await Field.query(knex).delete()
  await knex.table("sqlite_sequence").delete().where("name", "field")
  for (const field of fields) await Field.query(knex).insert(field)
}
