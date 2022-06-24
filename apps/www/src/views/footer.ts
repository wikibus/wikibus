import { html, FocusNodeViewContext, Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import { dash, rdf, schema } from '@tpluscode/rdf-ns-builders'

const footerRenderer: Renderer<FocusNodeViewContext> = {
  viewer: dash.FooterViewer,
  async init() {
    await Promise.all([
      import('../components/canvas-shell/canvas-footer'),
      import('../components/canvas-shell/canvas-gototop'),
    ])
  },
  render() {
    return html`
      <canvas-footer></canvas-footer>
      <canvas-gototop></canvas-gototop>`
  },
}

const footerViewer: ViewerMatcher = {
  viewer: dash.FooterViewer,
  match(ptr) {
    return ptr.resource.has(rdf.type, schema.WPFooter).term ? 100 : 0
  },
}

export const renderers = [footerRenderer]
export const viewers = [footerViewer]
