import { html, FocusNodeViewContext, Renderer, ObjectViewContext } from '@hydrofoil/roadshow'
import { dash } from '@tpluscode/rdf-ns-builders/strict'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import { TemplateResult } from 'lit'

export function renderHeader(primaryMenu?: () => TemplateResult) {
  return html`<canvas-header .primaryMenu="${primaryMenu}"></canvas-header>`
}

const headerLoading: Renderer = {
  viewer: roadshow.LoadingViewer,
  render() {
    return renderHeader()
  },
}

const headerLink: Renderer<ObjectViewContext> = {
  viewer: dash.LabelViewer,
  render(resource) {
    return html`<li>
      <a href="${resource.value!}">
        ${this.parent?.propertyShape.name}
      </a>
    </li>`
  },
}

const headerRenderer: Renderer<FocusNodeViewContext> = {
  viewer: dash.DetailsViewer,
  render() {
    const renderMenu = () => html`<ul>
      ${this.state.shape?.property.filter(p => !p.hidden).map(property => this.show({ property }))}
    </ul>`

    return renderHeader(renderMenu)
  },
}

export const renderers = [headerRenderer, headerLink, headerLoading]
export const viewers = []
