import { html, FocusNodeViewContext, Renderer, ObjectViewContext, ViewerMatcher } from '@hydrofoil/roadshow'
import { dash } from '@tpluscode/rdf-ns-builders'
import { TemplateResult } from 'lit'
import { rdf, schema } from '@tpluscode/rdf-ns-builders/strict'

export function renderHeader(primaryMenu?: () => TemplateResult) {
  return html`<canvas-header .primaryMenu="${primaryMenu}"></canvas-header>`
}

const headerLink: Renderer<ObjectViewContext> = {
  viewer: dash.HeaderLinkViewer,
  render(resource) {
    return html`<li>
      <a href="${resource.value!}">
        ${this.parent?.propertyShape.name}
      </a>
    </li>`
  },
}

const headerRenderer: Renderer<FocusNodeViewContext> = {
  viewer: dash.HeaderViewer,
  async init() {
    await import('../components/canvas-shell/canvas-header')
  },
  render() {
    const renderMenu = () => html`<ul>
      ${this.state.shape?.property.filter(p => !p.hidden).map(property => this.show({ property }))}
    </ul>`

    return renderHeader(renderMenu)
  },
}

const headerViewer: ViewerMatcher = {
  viewer: dash.HeaderViewer,
  match(ptr) {
    return ptr.resource.has(rdf.type, schema.WPHeader).term ? 100 : 0
  },
}

export const renderers = [headerRenderer, headerLink]
export const viewers = [headerViewer]
