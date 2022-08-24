import { SELECT } from '@tpluscode/sparql-builder'
import { schema, hydra, skos } from '@tpluscode/rdf-ns-builders'
import type { Term, NamedNode } from '@rdfjs/types'
import type { ParsingClient } from 'sparql-http-client/ParsingClient'
import { fromRdf } from 'rdf-literal'
import $rdf from 'rdf-ext'

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

const lang = $rdf.variable('lang')
const langOrder = $rdf.variable('langOrder')

export async function getPageMeta({ appUrl, base, client }: GetPageMeta): Promise<PageMeta> {
  const [result] = await SELECT`?res ?label ?note ?imageUrl ?imageWidth ?imageHeight`
    .WHERE`
      bind (iri(replace(str(${appUrl}), "/app", "")) as ?res)
    
      optional {
        ?res ${hydra.title}|${skos.prefLabel} ?label
        
        BIND(lang(?label) as ${lang})
        BIND(COALESCE(
          # agnostic label first
          IF(${lang} = '', 0, 1/0),
          # then English, then all others
          IF(${lang} = 'en', 1, 2)
        ) as ${langOrder})
      }
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
    .ORDER().BY(langOrder).THEN.BY(lang)
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
