import { SparqlQueryLoader } from '@hydrofoil/labyrinth/lib/loader.js'
import { SELECT } from '@tpluscode/sparql-builder'
import { knossos } from '@hydrofoil/vocabularies/builders'
import getStream from 'get-stream'
import type { ResourceLoaderFactory } from '@hydrofoil/knossos/lib/settings'
import type { Term, Literal } from '@rdfjs/types'
import $rdf from 'rdf-ext'

interface ResourceTemplate {
  pattern: Term
  template: Literal
}

declare module 'hydra-box' {
  interface Resource {
    mainEntity?: string
  }
}

export const factory: ResourceLoaderFactory = async (
  { sparql, client },
  inner = new SparqlQueryLoader(sparql as any),
) => {
  const results = await getStream.array<ResourceTemplate>(await SELECT.DISTINCT`?pattern ?template`
    .WHERE`
      ?template a ${knossos.WebPageTemplate} ; ${knossos.pattern} ?pattern .
    `
    .execute(client.query))

  const templates = results.map(({ template, pattern }) => ({
    template: template.value,
    pattern: new RegExp(pattern.value),
  }))

  return {
    async forClassOperation(term) {
      const found = templates
        .map(({ template, pattern }) => {
          const matches = term.value.match(pattern)
          if (matches?.[1]) {
            return {
              mainEntity: matches[1],
              template,
            }
          }
          return null
        })
        .filter(Boolean)
        .shift()

      if (found) {
        const [boxResource] = await inner.forClassOperation($rdf.namedNode(found.template))
        if (boxResource) {
          boxResource.mainEntity = found.mainEntity
          return [boxResource]
        }
        return []
      }

      return inner.forClassOperation(term)
    },
    forPropertyOperation(term) {
      return inner.forPropertyOperation(term)
    },
  }
}
