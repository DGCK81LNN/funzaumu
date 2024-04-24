import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("funzaumu", (table) => {
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
    .createTable("field", (table) => {
      table.increments("id").primary()
      table.double("index")
      table.string("name")
      table.string("label")
      table.string("comment")
      table.string("type")
      table.json("type_info")
    })
    .createTable("revision", (table) => {
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
    .createTable("user", (table) => {
      table.increments("id").primary()
      table.string("name")
      table.string("email")
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable("funzaumu")
    .dropTable("field")
    .dropTable("revision")
    .dropTable("user")
}
