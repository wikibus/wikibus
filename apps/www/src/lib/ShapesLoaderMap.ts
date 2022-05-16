import TermMap from '@rdfjs/term-map'
import type { NamedNode } from '@rdfjs/types'
import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import type { HydraClient } from 'alcaeus/alcaeus'
import { byOrder } from './shape'
import { dashShape } from './dashShapeLoader'
import { errorShape } from './shapeLoader/error'
import { dereferencedShapes } from './shapeLoader/dereferenced'

const combineLoaders = (...loaders: ShapesLoader[]): ShapesLoader => async (arg, state) => {
  for (const load of loaders) {
    // eslint-disable-next-line no-await-in-loop
    const shapes = await load(arg, state)
    if (shapes.length) {
      return shapes.sort(byOrder)
    }
  }

  return []
}

export default class {
  private map = new TermMap<NamedNode, ShapesLoader>()

  constructor(private client: HydraClient) {
  }

  get(role: NamedNode): ShapesLoader {
    let loader = this.map.get(role)
    if (!loader) {
      loader = combineLoaders(
        async (arg, state) => (state.shape ? [state.shape.pointer] : []),
        dashShape(this.client),
        errorShape,
        dereferencedShapes.bind(null, role),
      )
      this.map.set(role, loader)
    }

    return loader
  }
}
