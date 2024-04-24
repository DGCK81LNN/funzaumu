export default {
  debug: true,
  client: "better-sqlite3",
  connection: {
    filename: "./db/data.db",
  },
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
    loadExtensions: [".ts"],
  },
  seeds: {
    directory: "./db/seeds",
    extension: "ts",
    loadExtensions: [".ts"],
  },
  useNullAsDefault: true,
} as import("knex").Knex.Config
