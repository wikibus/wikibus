import { sparql } from '@tpluscode/sparql-builder'
import { ToSparqlPatterns } from '@hydrofoil/labyrinth/lib/query'
import { GraphPointer } from 'clownface'
import { sh } from '@tpluscode/rdf-ns-builders'
import { isGraphPointer } from 'is-graph-pointer'
import { toSparql } from 'clownface-shacl-path'

type Args = [{ path?: GraphPointer; flags?: string }]

export const fullTextSearch: ToSparqlPatterns<Args> = ({ subject, predicate, object, variable }, { path, flags = '' } = {}) => {
  const value = variable('value')
  const shPath = path?.out(sh.path)
  const propertyPath = isGraphPointer(shPath) ? toSparql(shPath) : predicate

  return sparql`
    ${subject} ${propertyPath} ${value} .
    
    FILTER(regex(str(${value}), "${object.value}", "${flags}"))
  `
}
