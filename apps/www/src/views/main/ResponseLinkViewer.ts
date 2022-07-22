import { Renderer, html } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { parseLinkHeader } from '@web3-storage/parse-link-header'
import { isNamedNode } from 'is-graph-pointer'
import namespace from '@rdfjs/namespace'

const rel = namespace('https://www.w3.org/ns/iana/link-relations/relation')

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.ResponseLinkViewer,
  render(obj) {
    if (isNamedNode(obj)) {
      if (!this.params.core.client?.resources.get(obj.term)) {
        this.controller.resources.loadToState(this.state)
      }

      const relation = this.parent?.propertyShape.pointer.out(rel()).value

      // TODO expose headers in roadshow resource controller
      const link = parseLinkHeader(this.params.core.client?.resources.get(obj.term)?.response?.xhr.headers.get('link'))

      if (relation && link?.[relation]) {
        return html`
          <li>
            <a href="${link[relation].url}">${this.parent?.propertyShape.name}</a>
          </li>`
      }
    }

    return ''
  },
}
