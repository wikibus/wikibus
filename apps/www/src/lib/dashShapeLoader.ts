import clownface, { GraphPointer } from 'clownface'
import type { BlankNode, NamedNode } from '@rdfjs/types'
import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import type { HydraClient } from 'alcaeus/alcaeus'
import Dataset from '@rdfjs/dataset'
import { findNodes } from 'clownface-shacl-path'
import TermMap from '@rdfjs/term-map'
import factory from './rdf'
import childShapesPathFactory from './childShapes.ttl'

function isResource(ptr: GraphPointer): ptr is GraphPointer<NamedNode | BlankNode> {
  return ptr.term.termType === 'NamedNode' || ptr.term.termType === 'BlankNode'
}

function isNamedNode(ptr: GraphPointer): ptr is GraphPointer<NamedNode> {
  return ptr.term.termType === 'NamedNode'
}

function notNull<T>(arg: T | null): arg is T {
  return !!arg
}

export const dashShape = (client: HydraClient): ShapesLoader => {
  function loadNamedShape(uri: string) {
    return client.loadResource(uri)
      .then(({ representation }) => {
        if (representation?.root?.hasType(sh.NodeShape)) {
          return representation.root.pointer
        }

        return null
      })
      .catch(() => null)
  }

  const childShapesPath = clownface({
    dataset: Dataset.dataset(childShapesPathFactory(factory)),
  }).has(sh.path).out(sh.path)

  async function loadBlankDashShape(pointer: GraphPointer): Promise<GraphPointer<any>> {
    const childShapes = findNodes(pointer, childShapesPath).filter(isNamedNode)
    const promises = childShapes.toArray().reduce((map, shape) => {
      if (!map.has(shape.term)) {
        map.set(shape.term, loadNamedShape(shape.value))
      }

      return map
    }, new TermMap<NamedNode, Promise<GraphPointer<NamedNode | BlankNode> | null>>())

    const pointers = [pointer, ...(await Promise.all([...promises.values()])).filter(notNull)]

    const quads = pointers
      .flatMap(ptr => [...ptr.dataset.match(null, null, null, ptr._context[0].graph)])
      .map(({ subject, predicate, object }) => factory.quad(subject, predicate, object))

    return clownface({
      dataset: Dataset.dataset(quads),
      term: pointer.term,
    })
  }

  return async (resource) => {
    const dashShapes = resource.out(dash.shape).toArray().filter(isResource)

    const promises = dashShapes.map((shape) => {
      if (shape.term.termType === 'BlankNode') {
        return loadBlankDashShape(shape)
      }

      return loadNamedShape(shape.value)
    })

    const results = await Promise.all(promises)
    return results.filter(notNull)
  }
}
