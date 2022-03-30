import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import { hydra, rdf, sh } from '@tpluscode/rdf-ns-builders/strict'
import $rdf from 'rdf-ext'
import clownface from 'clownface'
import errorShapeFactory from '../../shapes/error.ttl'

export const errorShape: ShapesLoader = async (arg) => {
  if (arg.has(rdf.type, hydra.Error).terms.length) {
    const dataset = $rdf.dataset(errorShapeFactory($rdf))
    return clownface({ dataset }).has(rdf.type, sh.NodeShape).toArray()
  }

  return []
}
