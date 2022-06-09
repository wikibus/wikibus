import { Renderer, html } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { parseLinkHeader } from '@web3-storage/parse-link-header'
import { isNamedNode } from 'is-graph-pointer'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.ResponseLinkViewer,
  render(obj) {
    if (isNamedNode(obj)) {
      if (!this.params.core.client?.resources.get(obj.term)) {
        this.controller.resources.loadToState(this.state)
      }

      // TODO expose headers in roadshow resource controller
      const link = parseLinkHeader(this.params.core.client?.resources.get(obj.term)?.response?.xhr.headers.get('link'))

      if (link?.['edit-form']) {
        return html`
          <li>
            <a href="${link['edit-form'].url}">${this.parent?.propertyShape.name}</a>
          </li>`
      }
    }

    return ''
  },
}
