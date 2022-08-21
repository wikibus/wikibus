import type * as express from 'express'
import type { ParsingClient } from 'sparql-http-client/ParsingClient'
import absoluteUrl from 'absolute-url'
import { asyncMiddleware } from 'middleware-async'
import { compile } from 'micromustache'
import $rdf from 'rdf-ext'
import * as rdf from 'rdf-express-node-factory'
import { getPageMeta as getPageMetaDefault } from './lib/findMeta'

interface Factory {
  index: string
  client: ParsingClient
  getPageMeta?: typeof getPageMetaDefault
}

export default function factory({
  index,
  client,
  getPageMeta = getPageMetaDefault,
}: Factory): express.RequestHandler {
  const template = compile(index)

  return asyncMiddleware(async (req, res) => {
    absoluteUrl.attach(req)
    rdf.attach(req)

    const meta = await getPageMeta({
      appUrl: $rdf.namedNode(req.absoluteUrl()),
      base: req.rdf.namedNode('/').value,
      client,
    })

    res.header('content-type', 'text/html')
    res.header('last-modified', meta.lastModified?.toUTCString())
    res.send(template.render(meta))
  })
}
