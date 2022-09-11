import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { schema, skos } from '@tpluscode/rdf-ns-builders'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import fromStream from 'rdf-dataset-ext/fromStream.js'
import { isGraphPointer } from 'is-graph-pointer'
import type { NamedNode } from '@rdfjs/types'
import { wba } from './ns.js'

export const loadSkos: ResourceHook = async ({ req, pointer }) => {
  const mainEntity = req.hydra.resource.uriTemplateVariables?.out(schema.mainEntity)

  if (isGraphPointer(mainEntity)) {
    const query = (rel: NamedNode) => CONSTRUCT.WHERE`
      ${mainEntity.term} ${rel} ?concept .
      ?concept ${skos.prefLabel} ?label ; a ?type .
    `

    const brandQuery = CONSTRUCT`
      ${mainEntity.term} ${schema.brand} ?brand . 
      ?brand ${skos.prefLabel} ?label .
    `.WHERE`
      ${mainEntity.term} ${skos.broader}* ?brand .
      ?brand a ${schema.Brand} ; ${skos.prefLabel} ?label  .
    `

    await Promise.all([
      fromStream(pointer.dataset, await brandQuery.execute(req.labyrinth.sparql.query)),
      fromStream(pointer.dataset, await query(skos.narrower).execute(req.labyrinth.sparql.query)),
      fromStream(pointer.dataset, await query(skos.broader).execute(req.labyrinth.sparql.query)),
    ])
  }
}

export const prepareSocialPostingsLink: ResourceHook = ({ req, pointer }) => {
  const mainEntity = req.hydra.resource.uriTemplateVariables?.out(schema.mainEntity)
  if (!isGraphPointer(mainEntity)) return

  pointer
    .node(req.hydra.term)
    .addOut(wba.socialMediaPostings, req.rdf.namedNode(`/social-media-postings?what=${encodeURIComponent(mainEntity.value)}`))
}
