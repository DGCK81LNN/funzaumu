import { readFile } from "fs/promises"
import type { Knex } from "knex"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { Field, Funzaumu, Revision } from "../models.js"

export async function seed(knex: Knex): Promise<void> {
  const _dirname = dirname(fileURLToPath(import.meta.url))
  const tsv = (await readFile(resolve(_dirname, "funzaumu.tsv"))).toString()
  const rows = tsv
    .replace(/(?:\r?\n)+$/, "")
    .split(/\r?\n/g)
    .map((line) => line.split("\t"))
  const head = rows.shift()!
  const data = rows.map((row) =>
    Object.fromEntries(
      head.map((colName, index) => [colName, row[index]] as const),
    ),
  )

  const fields: Record<string, number | null> = {}
  for (const colName of head) {
    const f = await Field.query(knex).findOne({ name: colName })
    //console.log(f)
    fields[colName] = f?.id ?? null
  }

  await Revision.query(knex).delete()
  await Funzaumu.query(knex).delete()
  await knex
    .table("sqlite_sequence")
    .delete()
    .whereIn("name", ["field", "funzaumu", "revision"])

  const timestamp = Date.now() / 1000

  for (let i = 0; i < data.length; i++) {
    const funzaumu = data[i]
    const funzaumu_id = (
      await Funzaumu.query(knex).insertAndFetch({
        name: funzaumu.name,
        code: funzaumu.code,
        chat: funzaumu.chat,
        han: funzaumu.han,
      })
    ).id
    for (const [field, value] of Object.entries(funzaumu)) {
      if (!value) continue
      const field_id = fields[field]
      if (field_id == null) continue
      await Revision.query(knex).insert({
        funzaumu_id,
        field_id,
        value,
        timestamp,
      })
    }
  }
}
