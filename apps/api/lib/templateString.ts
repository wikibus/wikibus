import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'

export function interpolateQuery(template: string, params = {}): SparqlTemplateResult {
  const names = Object.keys(params)
  const vals = Object.values(params)
  // eslint-disable-next-line no-new-func
  return new Function('tag', ...names, `return tag\`${template}\`;`)(sparql, ...vals)
}
