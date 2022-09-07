import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { hydra, rdf, rdfs, schema, skos } from '@tpluscode/rdf-ns-builders'
import { SELECT } from '@tpluscode/sparql-builder'
import $rdf from 'rdf-ext'
import getStream from 'get-stream'
import type { Term } from '@rdfjs/types'
import { hex } from '@hydrofoil/vocabularies/builders'
import { Filter } from '@hydrofoil/labyrinth/lib/query'
import { sparql } from '@tpluscode/rdf-string'

export const createAlphabeticPager: ResourceHook = async ({ req, pointer }) => {
  const letterVar = $rdf.variable('letter')
  const letters = await getStream.array<{ letter: Term }>(await SELECT.DISTINCT`?letter`
    .WHERE`
      ?brand a ${schema.Brand} .
      GRAPH ?brand {
        ?brand ${skos.prefLabel} ?label .
        
        BIND(STR(UCASE(substr(?label, 1, 1))) as ?letter)
      }
    `
    .ORDER().BY(letterVar)
    .execute(req.labyrinth.sparql.query))

  if (letters.length) {
    pointer.addOut(hydra.view, (view) => {
      letters.forEach(({ letter }) => {
        const pageLink = view.namedNode(`?i=${letter.value.toLowerCase()}`)
          .addOut(rdfs.label, letter)
        view.addOut(hex.page, pageLink)
          .addOut(rdf.type, hex.AlphabeticallyPagedView)
      })
    })
  }
}

export const filterByInitial: Filter = ({ subject, predicate, object, variable }) => sparql`
    ${subject} ${predicate} ${variable('value')} .
    
    FILTER(STRSTARTS(LCASE(${variable('value')}), LCASE(${object.term}))) 
  `
