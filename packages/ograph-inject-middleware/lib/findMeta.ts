import { SELECT } from '@tpluscode/sparql-builder'
import { schema, hydra, skos } from '@tpluscode/rdf-ns-builders'
import type { Term, NamedNode } from '@rdfjs/types'
import type { ParsingClient } from 'sparql-http-client/ParsingClient'
import { fromRdf } from 'rdf-literal'

interface PageMeta {
  title?: string
  description?: string
  image?: {
    url: string
    width?: string
    height?: string
  }
  lastModified?: Date
  url?: string
}

type Bindings = Partial<Record<'res' | 'label' | 'note' | 'imageUrl' | 'imageWidth' | 'imageHeight' | 'lastModified', Term>>

interface GetPageMeta {
  appUrl: NamedNode
  base: string
  client: ParsingClient
}

export async function getPageMeta({ appUrl, base, client }: GetPageMeta): Promise<PageMeta> {
  const [result] = await SELECT`?res ?label ?note ?imageUrl ?imageWidth ?imageHeight`
    .WHERE`
      bind (iri(replace(str(${appUrl}), "/app", "")) as ?res)
    
      optional { ?res ${hydra.title}|${skos.prefLabel} ?label }
      optional { ?res ${hydra.description}|${skos.note} ?note }
      optional { 
        ?res ${schema.image} ?pageImage
      }
      
      ?e a </api/Entrypoint> .
      ?e ${schema.image} ?defaultImage .
      
      BIND(COALESCE(?pageImage, ?defaultImage) as ?image)
      
      ?image ${schema.contentUrl} ?imageUrl .
      OPTIONAL {
        ?image ${schema.width} ?imageWidth .
        ?image ${schema.height} ?imageHeight .
      }
    `
    .execute(client.query, { base }) as Bindings[]

  if (result) {
    const meta: PageMeta = {
      title: result.label?.value,
      description: result.note?.value,
      url: result.res?.value,
    }

    if (result.imageUrl) {
      meta.image = {
        url: result.imageUrl.value,
        width: result.imageWidth?.value,
        height: result.imageHeight?.value,
      }
    }

    if (result.lastModified?.termType === 'Literal') {
      meta.lastModified = fromRdf(result.lastModified)
    }

    return meta
  }

  return {}
}
