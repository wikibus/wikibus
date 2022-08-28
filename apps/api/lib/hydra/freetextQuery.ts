import { Filter } from '@hydrofoil/labyrinth/lib/query'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { sparql } from '@tpluscode/rdf-string'

export const contains: Filter = ({ subject, object, variable }) => sparql`
  ${subject} ${rdfs.label} ${variable('label')} .
  
  FILTER( REGEX(${variable('label')}, "${object.value}", "i") )
`
