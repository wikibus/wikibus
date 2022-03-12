import { html, FocusNodeViewContext, Renderer, ObjectViewContext } from '@hydrofoil/roadshow'
import { dash } from '@tpluscode/rdf-ns-builders/strict'
import { roadshow } from '@hydrofoil/vocabularies/builders'

const headerLoading: Renderer = {
  viewer: roadshow.LoadingViewer,
  render() {
    return html`<canvas-header></canvas-header>`
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

    return html`<canvas-header .primaryMenu="${renderMenu}"></canvas-header>`
  },
}

export const renderers = [headerRenderer, headerLink, headerLoading]
export const viewers = []
