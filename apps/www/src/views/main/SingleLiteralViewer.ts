import { MultiRenderer } from '@hydrofoil/roadshow'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { html } from 'lit'
import { taggedLiteral } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'

export const renderer: MultiRenderer = {
  viewer: dash.SingleLiteralViewer,
  render(ptr) {
    return html`${taggedLiteral(ptr)}`
  },
}
