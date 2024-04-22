import { Model } from "objection"

export class Funzaumu extends Model {
  static tableName = "funzaumu"
  static get relationMappings() {
    return {
      revisions: {
        relation: Model.HasManyRelation,
        modelClass: Revision,
        join: {
          from: "funzaumu.revision_id",
          to: "revision.id",
        },
      },
    }
  }
}

export class Field extends Model {
  static tableName = "field"
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
}
