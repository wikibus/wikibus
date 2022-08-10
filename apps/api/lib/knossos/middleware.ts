import { MiddlewareFactory } from '@hydrofoil/knossos/configuration'
import { hydra, rdf, schema, skos } from '@tpluscode/rdf-ns-builders'
import clownface from 'clownface'
import { turtle } from '@tpluscode/rdf-string'
import { wba } from '../ns.js'

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
    if (req.hydra.resource.types.has(wba.Vehicle)) {
      const resource = turtle`<> ${skos.broader} ${req.hydra.resource.term} .`

      res.setLink(`/page/vehicle/new#${encodeURIComponent(resource.toString())}`, 'create-form')
    }
  }

  next()
}
