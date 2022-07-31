import type { NamedNode } from '@rdfjs/types'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { sparql } from '@tpluscode/sparql-builder'
import { VALUES } from '@tpluscode/sparql-builder/expressions'
import { interpolateQuery } from '../templateString.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const queryTemplateSrc = join(__dirname, 'fetchDbpedia.ru')
const queryTemplate = readFileSync(queryTemplateSrc).toString().replaceAll('#{', '${')

export default function (res: NamedNode) {
  const resourceValues = sparql`${VALUES({ res })}`

  return interpolateQuery(queryTemplate, {
    resourceValues,
  })
}
