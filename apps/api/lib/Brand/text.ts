import type { Handler } from '@hydrofoil/knossos-events'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { createMarkdown } from 'safe-marked'
import $rdf from 'rdf-ext'
import { DELETE, SELECT, WITH } from '@tpluscode/sparql-builder'
import getStream from 'get-stream'
import type { Term } from '@rdfjs/types'
import { markdown } from '../mediaTypes.js'

const toHtml = createMarkdown()

export const render: Handler = async ({ event, req }) => {
  const brand = event.object?.pointer.term
  if (!brand) {
    return
  }

  const result = (await getStream.array<{ md: Term }>(
    await SELECT`?md`
      .WHERE`
        ${brand} ${schema.text} ?md
        FILTER(datatype(?md) = ${markdown})
      `
      .execute(req.labyrinth.sparql.query),
  )).shift()

  if (result?.md) {
    const html = $rdf.literal(toHtml(result.md.value), rdf.HTML)

    const deleteQuery = DELETE`
      ${brand} ${schema.text} ?html .
    `.INSERT`
      ${brand} ${schema.text} ${html} .
    `.WHERE`
      OPTIONAL {
        ${brand} ${schema.text} ?html .
      }
    `

    await WITH(`${brand.value}/article`, deleteQuery).execute(req.labyrinth.sparql.query)
  }
}
