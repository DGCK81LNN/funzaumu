import { fn, ref } from "objection"

export default defineEventHandler(async () => {
  const funzaumuLatestRevisions = await Revision.query(knex)
    .select("funzaumu_id")
    .select({ timestamp: fn.max(Revision.ref("timestamp")) })
    .groupBy(Revision.ref("funzaumu_id"))
    .orderBy(ref("timestamp"), "desc")
    .limit(20)
    .withGraphFetched("funzaumu")

  return funzaumuLatestRevisions.map(
    ({ timestamp, funzaumu: { id, code, name, han, chat } }) => ({
      timestamp,
      id,
      code,
      name,
      han,
      chat,
    }),
  )
})
