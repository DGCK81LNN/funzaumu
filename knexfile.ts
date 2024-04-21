import type { Knex } from "knex"
export default {
  client: "sqlite",
  connection: {
    filename: "./database/data.db",
  },
  migrations: {
    directory: "./database/migrations",
  },
} as Knex.Config
