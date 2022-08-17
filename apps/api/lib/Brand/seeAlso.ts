import type { Handler } from '@hydrofoil/knossos-events'
import { isNamedNode } from 'is-graph-pointer'
import { VALUES } from '@tpluscode/sparql-builder/expressions'
import { prepareQuery } from '../query.js'

export const categoriseLinks: Handler = async ({ req, event }) => {
  const resource = event.object?.pointer
  if (isNamedNode(resource)) {
    const resourceValues = VALUES({ res: resource.term })

    const update = prepareQuery('categoriseLinks.ru', { resourceValues }).toString()
    await req.labyrinth.sparql.query.update(update)
  }
}

export const fetchDbpedia: Handler = async ({ req, event }) => {
  const resource = event.object?.pointer
  if (isNamedNode(resource)) {
    const resourceValues = VALUES({ res: resource.term })

    const update = prepareQuery('fetchDbpedia.ru', { resourceValues }).toString()
    req.knossos.log('DBpedia update query %s', update)

    await req.labyrinth.sparql.query.update(update)
  }
}
