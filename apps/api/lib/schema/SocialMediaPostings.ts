import type { Handler } from '@hydrofoil/knossos-events'
import { isNamedNode } from 'is-graph-pointer'
import { VALUES } from '@tpluscode/sparql-builder/expressions'
import type { Filter } from '@hydrofoil/labyrinth/lib/query'
import { sparql } from '@tpluscode/rdf-string'
import { prepareQuery } from '../query.js'

export const createFromSameAs: Handler = async ({ req, event }) => {
  const resource = event.object?.pointer
  if (isNamedNode(resource)) {
    const resourceValues = VALUES({ res: resource.term })
    const mediaPostingBase = req.rdf.namedNode('/social-media-post/').value

    const update = prepareQuery('createSocialPostings.ru', { resourceValues, mediaPostingBase }).toString()
    await req.labyrinth.sparql.query.update(update)
  }
}

export const filterByMainEntity: Filter = ({ subject, predicate, object }) => sparql`${subject} ${predicate} <${object.value}> .`
