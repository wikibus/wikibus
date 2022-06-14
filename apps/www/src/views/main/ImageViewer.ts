import { Renderer, html, ViewerMatcher } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { schema, rdf } from '@tpluscode/rdf-ns-builders/strict'
import { ifDefined } from 'lit/directives/if-defined.js'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.ImageViewer,
  render(obj) {
    return html`<img src="${ifDefined(obj.out(schema.contentUrl).value)}" alt="${ifDefined(obj.out(schema.caption).value)}">`
  },
}

export const matcher: ViewerMatcher = {
  viewer: hex.ImageViewer,
  match({ resource }) {
    if (resource.has(rdf.type, schema.ImageObject).terms.length) {
      return 50
    }
    if (resource.has(schema.contentUrl).terms.length) {
      return null
    }
    return 0
  },
}
