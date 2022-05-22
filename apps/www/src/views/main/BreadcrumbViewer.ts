import { html, Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { schema } from '@tpluscode/rdf-ns-builders/strict'
import { hex } from '@hydrofoil/vocabularies/builders'

export const matcher: ViewerMatcher = {
  viewer: hex.BreadcrumbViewer,
  match({ resource }) {
    return resource.in(schema.breadcrumb).terms.length ? 100 : 0
  },
}

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.BreadcrumbViewer,
  render() {
    const items = this.state.properties.find(p => p.propertyShape.name === 'items')
    if (!items) {
      return ''
    }

    return html`<ol class="breadcrumb">
      ${this.show({ property: items, viewer: hex.BreadcrumbItemViewer })}
    </ol>`
  },
}
