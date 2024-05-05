export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, "id")
  if (!idStr || !idStr.match(/^[1-9]\d*$/))
    throw createError({
      statusCode: 400,
      message: "invalid-id",
    })
  const id = parseInt(idStr)

  const funzaumu = await Funzaumu.query(knex)
    .findById(id)
    .withGraphFetched("latestRevisions.[field, user]")
  if (!funzaumu)
    throw createError({
      statusCode: 401,
      message: "not-found",
    })

  return {
    id: funzaumu.id,
    fields: funzaumu.latestRevisions.map(
      ({
        field: { index, name, label, comment, type, type_info },
        value,
        timestamp,
        user,
      }) => ({
        index,
        name,
        label,
        comment,
        type,
        type_info,
        value,
        timestamp,
        user,
      }),
    )
  }
})
