import { Model, fn, type Modifiers, type Pojo } from "objection"
import type { JSONSchema } from "json-schema-to-ts"

export class Funzaumu extends Model {
  static tableName = "funzaumu"
  static get relationMappings() {
    return {
      revisions: {
        relation: Model.HasManyRelation,
        modelClass: Revision,
        join: {
          from: "funzaumu.id",
          to: "revision.funzaumu_id",
        },
      },
      latestRevisions: {
        relation: Model.HasManyRelation,
        modelClass: Revision,
        join: {
          from: "funzaumu.id",
          to: "revision.funzaumu_id",
        },
        modify: "latestOfEachField",
      },
    }
  }

  declare id: number
  declare code: string
  declare name: string
  declare chat: string
  declare han: string
  declare revisions: Revision[]
  declare latestRevisions: Revision[]
}

export class Field extends Model {
  static tableName = "field"

  declare id: number
  declare index: number
  declare name: string
  declare label: string
  declare comment: string
  declare type:
    | "mapping"
    | "notation"
    | "glyph"
    | "image"
    | "property"
    | "text"
    | "json"
    | "label"
  declare type_info: {
    // general
    pattern?: string
    default?: string
    // glyphs
    glyphDrawingMode?: "vector" | "line"
    glyphCategory?: string // handwriting, hanzi
    // properties
    options?: { value: string; label: string }[]
    // json
    schema?: JSONSchema
    // labels
    labelRole?: "h2" | "h3" | "h4" | "h5"
  } | null

  $parseDatabaseJson(o: Pojo) {
    super.$parseDatabaseJson(o)
    try {
      o.type_info = o.type_info ? JSON.parse(o.type_info) : null
    } catch (e) {
      console.error(e)
      o.type_info = null
    }
    return o
  }
}

export class Revision extends Model {
  static tableName = "revision"
  static get relationMappings() {
    return {
      funzaumu: {
        relation: Model.BelongsToOneRelation,
        modelClass: Funzaumu,
        join: {
          from: "revision.funzaumu_id",
          to: "funzaumu.id",
        },
      },
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: "revision.field_id",
          to: "field.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "revision.user_id",
          to: "user.id",
        },
      },
    }
  }
  static get modifiers(): Modifiers {
    return {
      latestOfEachField(builder) {
        if (!builder.hasSelects()) builder.select("*")
        builder
          .select({ timestamp: fn.max(Revision.ref("timestamp")) })
          .groupBy("field_id")
      },
    }
  }

  declare id: number
  declare funzaumu_id: number
  declare field_id: number
  declare value: string
  declare user_id: number
  declare timestamp: number
  declare summary: string
  declare funzaumu: Funzaumu
  declare field: Field
  declare user: User
}

export class User extends Model {
  static tableName = "user"
  static get relationMappings() {
    return {
      revisions: {
        relation: Model.HasManyRelation,
        modelClass: Revision,
        join: {
          from: "user.id",
          to: "revision.user_id",
        },
      },
    }
  }

  declare id: number
  declare name: string
  declare email: string
  declare revisions: Revision[]
}
