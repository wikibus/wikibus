import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { canvas } from '../../lib/ns'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: canvas.AlphabeticPager,
  async init() {
    await import('../../components/canvas-shell/canvas-pager')
  },
  render(view) {
    const links = view.out(hex.page)
      .map(link => ({ href: link.value, label: link.out(rdfs.label).value || '_' }))
      .sort((l, r) => l.label.localeCompare(r.label))

    return html`<canvas-pager .links="${links}"></canvas-pager>`
  },
}
