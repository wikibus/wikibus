import type { Handler } from '@hydrofoil/knossos-events'
import { isNamedNode } from 'is-graph-pointer'
import query from '../dbpedia/fetchDbpedia.js'

export const fetchDbpedia: Handler = async ({ req, event }) => {
  const resource = event.object?.pointer
  if (isNamedNode(resource)) {
    const update = query(resource.term).toString()
    req.knossos.log('DBpedia update query %s', update)

    await req.labyrinth.sparql.query.update(update)
  }
}
