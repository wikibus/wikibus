import { TransformVariable } from '@hydrofoil/knossos/collection'
import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import { schema, skos } from '@tpluscode/rdf-ns-builders'
import getStream from 'get-stream'
import type { Term, Literal } from '@rdfjs/types'
import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import fromStream from 'rdf-dataset-ext/fromStream.js'

export const createBrandSlug: TransformVariable = async ({ term, req }): Promise<Literal> => {
  const [first, ...excess] = await getStream.array<{ slug: Term }>(await SELECT.DISTINCT`?slug`
    .WHERE`
      ${term} ${skos.broader}* ?broader .
      ?broader a ${schema.Brand} ; ${skos.notation} ?slug .
    `
    .execute(req.labyrinth.sparql.query))

  if (excess.length) {
    throw new Error('Multiple slugs found')
  }

  if (first?.slug.termType !== 'Literal') {
    throw new Error('No brand sug found or not a literal')
  }

  return first.slug
}

export const initPrefLabel: ResourceHook = async ({ req, pointer }) => {
  const broader = pointer.out(skos.broader).term
  const name = pointer.out(schema.name).value

  const getPrefLabel = await CONSTRUCT`${pointer.term} ${skos.prefLabel} ?prefLabel`
    .WHERE`
      ${broader} ${skos.broader}* ?brand .
      ?brand a ${schema.Brand} ; ${skos.prefLabel} ?brandLabel .
      
      BIND(
        CONCAT(str(?brandLabel), " ", "${name}") as ?literal
      )
      
        BIND(
          IF(
            langMatches(lang(?brandLabel), "*"),
            strlang(?literal, lang(?brandLabel)),
            ?literal
          ) as ?prefLabel
        )
    `.execute(req.labyrinth.sparql.query)

  await fromStream(pointer.dataset, getPrefLabel)
}
