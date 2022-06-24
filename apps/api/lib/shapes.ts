import { sparql } from '@tpluscode/sparql-builder'
import type { Pattern } from '@hydrofoil/labyrinth/lib/query'
import { dash, sh } from '@tpluscode/rdf-ns-builders'

export function filterByTargetNode({ subject, object }: Pattern) {
  return sparql`{
    ${subject} ${sh.targetNode} <${object.value}>
  } union {
    <${object.value}> a ?type .
    ${subject} ${sh.targetClass}|${dash.applicableToClass} ?type .
  }`
}

export function filterByRole({ subject, predicate, object }: Pattern) {
  return sparql`${subject} ${predicate} <${object.value}>`
}
