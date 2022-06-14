import { html, Decorator, ObjectViewContext, PropertyViewContext, FocusNodeViewContext } from '@hydrofoil/roadshow'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

type AnyVC = ObjectViewContext | PropertyViewContext | FocusNodeViewContext

export const diagDecorator: Decorator<AnyVC> = {
  decorates: ['object', 'focusNode', 'property'],
  appliesTo() {
    return true
  },
  decorate(inner, context) {
    return html`
      ${unsafeHTML(`<!-- BEGIN ${context.state.viewer?.value} -->`)}
      ${inner}
      ${unsafeHTML(`<!-- END ${context.state.viewer?.value} -->`)}
    `
  },
}
