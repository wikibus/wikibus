import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { interpolateQuery } from './templateString.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function prepareQuery(path: string, variables: Record<string, unknown> = {}) {
  const queryTemplateSrc = join(__dirname, 'query', path)
  const queryTemplate = readFileSync(queryTemplateSrc).toString().replaceAll('#{', '${')

  return interpolateQuery(queryTemplate, variables)
}
