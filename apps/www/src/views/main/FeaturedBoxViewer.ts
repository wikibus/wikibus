import { html, ObjectViewContext, Renderer } from '@hydrofoil/roadshow'
import { canvas } from '../../lib/ns'
import { attributes } from '../attributes'

export const renderer: Renderer<ObjectViewContext> = {
  viewer: canvas.FeaturedBoxViewer,
  async init() {
    await import('../../components/canvas-shell/canvas-featured-box')
  },
  render(resource) {
    const propertyShape = this.parent?.propertyShape
    const title = propertyShape?.name || ''
    const description = propertyShape?.description || ''
    const icon = propertyShape?.getString(canvas.icon, { strict: false }) || 'line2-question'

    return html`<canvas-featured-box .href="${resource.value || '#'}" 
                                     .title="${title}"
                                     .icon="${icon}"
                                     .description="${description}"
                                     ${attributes(this.parent?.propertyShape)}
    ></canvas-featured-box>`
  },
}
