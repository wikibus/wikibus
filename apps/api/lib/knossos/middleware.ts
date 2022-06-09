import { MiddlewareFactory } from '@hydrofoil/knossos/configuration'
import { knossos } from '@hydrofoil/vocabularies/builders'
import clownface from 'clownface'

export const setEditLink: MiddlewareFactory = () => (req, res, next) => {
  if (req.hydra.resource) {
    const editable = clownface(req.hydra.api)
      .node(req.hydra.resource.types)
      .has(knossos.editable, true)
      .terms.length > 0

    if (editable) {
      res.setLink(`/page${req.path}/edit`, 'edit-form')
    }
  }
  next()
}
