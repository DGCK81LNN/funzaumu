import { toBb26 } from "bb26"
import type { Knex } from "knex"
import { Field } from "../models.js"
import type { PartialModelObject } from "objection"

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
      index: 31,
      name: "block",
      label: "区段 Block",
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
      index: 101,
      name: "upper_script",
      label: "大写手写体 Upper case script",
      type: "glyph",
    },
    {
      index: 102,
      name: "lower_script",
      label: "小写手写体 Lower case script",
      type: "glyph",
    },
    {
      index: 103,
      name: "middle_script",
      label: "中写手写体 Middle case script",
      type: "glyph",
    },
  ]

  await Field.query(knex).delete()
  await knex.table("sqlite_sequence").delete().where("name", "field")
  for (const field of fields) await Field.query(knex).insert(field)
}
