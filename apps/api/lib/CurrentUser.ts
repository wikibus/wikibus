import type * as express from 'express'
import etag from 'etag'

export const get: express.RequestHandler = (req, res) => {
  const userLink = req.agent || req.rdf.namedNode('/user/anonymous')

  res.setHeader('cache-control', 'max-age=0, stale-while-revalidate=360')
  res.setHeader('etag', etag(userLink.value))
  res.redirect(userLink.value)
}
