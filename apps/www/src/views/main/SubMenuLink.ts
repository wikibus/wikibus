import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { isGraphPointer } from 'is-graph-pointer'
import { canvas } from '../../lib/ns'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: canvas.SubMenuLink,
  render(link) {
    if (!isGraphPointer(link)) {
      return ''
    }

    return html`<li>
      <a href="${link.value}">${localizedLabel(this.parent?.propertyShape, { property: sh.name })}</a>
    </li>`
  },
}
