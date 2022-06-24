import type * as express from 'express'

export const get: express.RequestHandler = (req, res) => {
  const userLink = req.agent || req.rdf.namedNode('/user/anonymous')

  res.redirect(userLink.value)
}
