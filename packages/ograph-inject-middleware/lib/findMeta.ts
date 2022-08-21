import { SELECT } from '@tpluscode/sparql-builder'
import { schema, hydra, skos } from '@tpluscode/rdf-ns-builders'
import type { Term, NamedNode } from '@rdfjs/types'
import type { ParsingClient } from 'sparql-http-client/ParsingClient'
import { fromRdf } from 'rdf-literal'

interface PageMeta {
  title?: string
  description?: string
  image?: string
  lastModified?: Date
}

type Bindings = Partial<Record<'label' | 'note' | 'image' | 'lastModified', Term>>

interface GetPageMeta {
  appUrl: NamedNode
  base: string
  client: ParsingClient
}

export async function getPageMeta({ appUrl, base, client }: GetPageMeta): Promise<PageMeta> {
  const [result] = await SELECT`?label ?note ?image`
    .WHERE`
      bind (iri(replace(str(${appUrl}), "/app", "")) as ?res)
    
      optional { ?res ${hydra.title}|${skos.prefLabel} ?label }
      optional { ?res ${hydra.description}|${skos.note} ?note }
      optional { 
        ?res ${schema.image}/${schema.contentUrl} ?pageImage
      }
      
      OPTIONAL {
        <> ${schema.image}/${schema.contentUrl} ?defaultImage .
      }
      
      BIND(COALESCE(?pageImage, ?defaultImage) as ?image)
    `
    .execute(client.query, { base }) as Bindings[]

  if (result) {
    return {
      title: result.label?.value,
      description: result.note?.value,
      image: result.image?.value,
      lastModified: result.lastModified?.termType === 'Literal' && fromRdf(result.lastModified),
    }
  }

  return {}
}
