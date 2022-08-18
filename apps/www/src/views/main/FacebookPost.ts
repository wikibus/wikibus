import { html, ObjectViewContext, Renderer } from '@hydrofoil/roadshow'
import $rdf from '@rdfjs/data-model'

export const renderer: Renderer<ObjectViewContext> = {
  viewer: $rdf.namedNode('https://www.facebook.com/plugins/post'),
  async init() {
    await import('../../components/FacebookPostSlider')
  },
  render(ptr) {
    return html`<facebook-post-slider .links="${ptr.values}"></facebook-post-slider>`
  },
}
