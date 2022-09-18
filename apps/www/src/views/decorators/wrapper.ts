import { Decorator, FocusNodeViewContext, html, ObjectViewContext, PropertyViewContext } from '@hydrofoil/roadshow'
import type { RdfResource } from 'alcaeus'
import type { NamedNode } from '@rdfjs/types'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import { wrapper } from '../wrapper'

type AnyVC = ObjectViewContext | PropertyViewContext | FocusNodeViewContext

export const wrapperDecorator: Decorator<AnyVC> = {
  decorates: ['object', 'focusNode', 'property'],
  appliesTo() {
    return true
  },
  decorate(inner, context) {
    let shape: RdfResource | undefined
    let property: NamedNode | undefined
    let header = true

    switch (context.type) {
      case 'property':
        shape = context.state.propertyShape
        property = roadshow.propertyContainer
        header = context.state.objects.size > 0 ||
          context.controller.viewers.isMultiViewer(context.state.viewer!)
        break
      case 'object':
        shape = context.parent?.propertyShape
        break
      default:
        shape = context.state.shape || context.parent?.propertyShape
        break
    }

    return html`${wrapper({ shape, inner, property, header })}`
  },
}
