import { Decorator, html, PropertyViewContext } from '@hydrofoil/roadshow'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import { canvas } from '../../lib/ns'

export const sidebarWidget: Decorator<PropertyViewContext> = {
  decorates: ['property'],
  appliesTo(context) {
    const decoratorIri = context.state.propertyShape.pointer.out(roadshow.decorator).term

    return decoratorIri?.equals(canvas.SidebarWidget) || false
  },
  decorate(inner, context) {
    if (!context.state.objects.size) {
      return inner
    }

    return html`<div class="widget clearfix">
      <h4>${localizedLabel(context.state.propertyShape, { property: sh.name })}</h4>
      ${inner}
    </div>`
  },
}
