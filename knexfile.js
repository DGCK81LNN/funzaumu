/** @type {import("knex").Knex.Config} */
export default {
  debug: true,
  client: "better-sqlite3",
  connection: {
    filename: "./database/data.db",
  },
  migrations: {
    directory: "./database/migrations",
  },
  useNullAsDefault: true,
}
