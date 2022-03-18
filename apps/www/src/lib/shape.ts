import type { Shape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders/strict'
import type { GraphPointer } from 'clownface'
import { PropertyState } from '@hydrofoil/roadshow/lib/state'

type Orderable = PropertyState | Shape | GraphPointer | { order: number }

function getOrder(arg: Orderable): number {
  if ('order' in arg) {
    return arg.order
  }

  let pointer: GraphPointer | undefined
  if ('pointer' in arg) {
    ({ pointer } = arg)
  } else if ('propertyShape' in arg) {
    ({ pointer } = arg.propertyShape)
  } else {
    pointer = arg
  }

  return parseInt(pointer.out(sh.order).value || '0', 10) || 0
}
export function byOrder(l: Orderable, r: Orderable): number {
  return getOrder(l) - getOrder(r)
}
