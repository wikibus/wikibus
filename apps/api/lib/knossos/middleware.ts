import { MiddlewareFactory } from '@hydrofoil/knossos/configuration'
import { hydra, rdf, schema } from '@tpluscode/rdf-ns-builders'
import clownface from 'clownface'

export const setEditLink: MiddlewareFactory = () => (req, res, next) => {
  if (req.hydra.resource) {
    const editable = clownface(req.hydra.api)
      .node(req.hydra.resource.types)
      .out(hydra.supportedOperation)
      .has(rdf.type, schema.ReplaceAction)
      .terms.length > 0

    if (editable) {
      res.setLink(`/page${req.path}/edit`, 'edit-form')
    }
  }
  next()
}
