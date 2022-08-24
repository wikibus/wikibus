import { html } from '@hydrofoil/shaperone-wc'
import { ObjectTemplate } from '@hydrofoil/shaperone-wc/templates'
import TermSet from '@rdfjs/term-set'
import { sh1 } from '../lib/ns'

export function objectFilter(inner: ObjectTemplate): ObjectTemplate {
  const decorated: ObjectTemplate = (context, arg) => {
    const excludedPointer = context.property.shape.pointer.out(sh1.except)
    if (excludedPointer.isList()) {
      const excluded = new TermSet([...excludedPointer.list()].map(({ term }) => term))

      const isExcluded = arg.object.object && excluded.has(arg.object.object.term)

      if (isExcluded) {
        return html``
      }
    }

    return inner(context, arg)
  }

  decorated.loadDependencies = inner.loadDependencies

  return decorated
}
