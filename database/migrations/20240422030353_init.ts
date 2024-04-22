import { Knex } from "knex"
import { Field } from "../models"
import { toBb26 } from "bb26"

const blocks = [
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
  blocks.push(`希吕音字 Infinite Shidinn Phonemic ${toBb26(i)}`)
}

function hex(n: number) {
  return n.toString(16).toUpperCase().padStart(2, "0")
}

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable("funzaumu", (table) => {
    table.increments("id").primary()
    table
      .integer("revision_id")
      .references("id")
      .inTable("revision")
      .onDelete("restrict")
    table.string("code")
    table.string("name")
    table.string("chat")
    table.string("han")
  })
  knex.schema.createTable("field", (table) => {
    table.increments("id").primary()
    table.double("index")
    table.string("name")
    table.string("label")
    table.string("comment")
    table.string("type")
    table.json("type_info")
  })
  knex.schema.createTable("revision", (table) => {
    table.increments("id").primary()
    table
      .integer("funzaumu_id")
      .notNullable()
      .references("id")
      .inTable("funzaumu")
      .onDelete("restrict")
    table
      .integer("field_id")
      .notNullable()
      .references("id")
      .inTable("field")
      .onDelete("restrict")
    table.string("value").notNullable()
    table
      .integer("user_id")
      .references("id")
      .inTable("user")
      .onDelete("set null")
    table.timestamp("timestamp")
    table.string("summary")
  })
  knex.schema.createTable("user", (table) => {
    table.increments("id").primary()
    table.string("name")
    table.string("email")
  })

  Field.query(knex).insert([
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
  ])
  Field.query(knex).insert([
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
  ])
  Field.query(knex).insert([
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
  ])
  Field.query(knex).insert({
    index: 31,
    name: "block",
    label: "区段 Block",
    type: "property",
    type_info: JSON.stringify({
      options: [
        {
          value: "",
          label: "无 None",
        },
        ...blocks.map((name, index) => ({
          value: hex(index << 6),
          label: `${hex(index << 6)}-${hex((index << 6) | 63)}. ${name}`,
        })),
      ],
    }),
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable("funzaumu")
  knex.schema.dropTable("field")
  knex.schema.dropTable("revision")
  knex.schema.dropTable("user")
}
