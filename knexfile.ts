export default {
  debug: "KNEX_DEBUG" in process.env,
  client: "better-sqlite3",
  connection: {
    filename: "./db/data.db",
  },
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
  useNullAsDefault: true,
} as import("knex").Knex.Config
