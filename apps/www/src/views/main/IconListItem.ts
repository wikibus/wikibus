import { html, ObjectViewContext, Renderer } from '@hydrofoil/roadshow'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { canvas } from '../../lib/ns'

export const renderer: Renderer<ObjectViewContext> = {
  viewer: canvas.IconListItem,
  render(ptr) {
    const shape = this.parent?.propertyShape.pointer
    const icon = shape?.out(canvas.icon).value || 'icon-line2-question'

    if (!ptr.value) {
      return ''
    }

    return html`<li>
      <i class="${icon}"></i>
      <a href="${ptr.value}">
        ${localizedLabel(ptr)}
      </a>
    </li>`
  },
}
