import { MultiRenderer } from '@hydrofoil/roadshow'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh, skos } from '@tpluscode/rdf-ns-builders'
import { isGraphPointer } from 'is-graph-pointer'
import { canvas } from '../../lib/ns'

export const renderer: MultiRenderer = {
  viewer: canvas.SidebarRelatedResourceViewer,
  render(ptr) {
    const concepts = ptr.toArray().sort((l, r) => l.value.localeCompare(r.value))

    return html`
      <div class="widget clearfix">
        <h4>${localizedLabel(this.state.propertyShape.pointer, { property: sh.name })}</h4>
        <ul class="iconlist">
          ${repeat(concepts, concept => html`<li>${this.object(concept, { resource: renderLink })}</li>`)}
        </ul>
      </div>
    `
  },
}

function renderLink(this: FocusNodeViewContext) {
  if (isGraphPointer(this.node)) {
    return html`<i class="icon-bus"></i> <a href="${this.node.value}">${localizedLabel(this.node, { property: skos.prefLabel })}</a>`
  }

  return ''
}
