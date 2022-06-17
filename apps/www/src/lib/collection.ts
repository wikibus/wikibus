import { hex } from '@hydrofoil/vocabularies/builders'
import { GraphPointer } from 'clownface'
import { findNodes } from 'clownface-shacl-path'
import { hydra, rdf } from '@tpluscode/rdf-ns-builders/strict'

export function byAnnotatedPaths(orderable: GraphPointer | undefined) {
  function iteratePaths() {
    const orderedBy = orderable
      ?.out(hydra.view)
      .has(rdf.type, hex.OrderedCollectionView)
      .out(hex.orderedBy)
      .toArray()
      .shift()

    const list = orderedBy?.list()
    return list ? [...list] : []
  }

  return (left: GraphPointer, right: GraphPointer): number => {
    const paths = iteratePaths()
    let result = 0
    let path = paths.shift()
    while (!result && path) {
      const leftValue = findNodes(left, path).value || ''
      const rightValue = findNodes(right, path).value || ''
      result = leftValue.localeCompare(rightValue)
      path = paths.shift()
    }

    return result
  }
}
