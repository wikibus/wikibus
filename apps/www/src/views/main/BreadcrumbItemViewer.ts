import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { schema } from '@tpluscode/rdf-ns-builders/strict'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.BreadcrumbItemViewer,
  render(resource) {
    return html`<li class="breadcrumb-item">
      <a href="${resource.out(schema.item).value || '#'}">${resource.out(schema.name).value}</a>
    </li>`
  },
}
