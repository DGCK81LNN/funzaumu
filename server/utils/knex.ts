import Knex from "knex"
import knexConfig from "~/knexfile"

export const knex = Knex(knexConfig)

export * from "../../db/models"
