import { html, ObjectViewContext, Renderer } from '@hydrofoil/roadshow'
import $rdf from '@rdfjs/data-model'
import { ifDefined } from 'lit/directives/if-defined.js'

export const renderer: Renderer<ObjectViewContext> = {
  viewer: $rdf.namedNode('https://iframe.ly/embed/'),
  async init() {
    await import('../../components/iframe-ly')
    await import('@shoelace-style/shoelace/dist/components/spinner/spinner.js')
  },
  render(ptr) {
    return html`<iframe-ly href="${ifDefined(ptr.value)}" header footer>
      <sl-spinner></sl-spinner>
    </iframe-ly>`
  },
}
