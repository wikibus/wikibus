import { html, FocusNodeViewContext, Renderer, ObjectViewContext, ViewerMatcher } from '@hydrofoil/roadshow'
import { dash } from '@tpluscode/rdf-ns-builders'
import { rdf, schema } from '@tpluscode/rdf-ns-builders/strict'
import { hex } from '@hydrofoil/vocabularies/builders'

const headerLink: Renderer<ObjectViewContext> = {
  viewer: dash.HeaderLinkViewer,
  render(resource) {
    return html`
      <a href="${resource.value!}" slot="menu-link">
        ${this.parent?.propertyShape.name}
      </a>
    `
  },
}

const headerRenderer: Renderer<FocusNodeViewContext> = {
  viewer: dash.HeaderViewer,
  async init() {
    await import('../components/canvas-shell/canvas-header')
  },
  render() {
    const properties = this.state.shape?.property.filter(p => !p.hidden) || []

    return html`<canvas-header>
      ${properties.map(property => this.show({ property }))}
    </canvas-header>`
  },
}

const headerViewer: ViewerMatcher = {
  viewer: dash.HeaderViewer,
  match(ptr) {
    return ptr.resource.has(rdf.type, schema.WPHeader).term ? 100 : 0
  },
}

const profileMenu: Renderer<FocusNodeViewContext> = {
  viewer: hex.AuthStatusViewer,
  async init() {
    await Promise.all([
      import(/* webpackChunkName: 'profile-menu' */ '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'),
      import(/* webpackChunkName: 'profile-menu' */ '@shoelace-style/shoelace/dist/components/button/button.js'),
      import(/* webpackChunkName: 'profile-menu' */ '@shoelace-style/shoelace/dist/components/icon/icon.js'),
      import(/* webpackChunkName: 'profile-menu' */ '@shoelace-style/shoelace/dist/components/menu/menu.js'),
      import(/* webpackChunkName: 'profile-menu' */ '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'),
    ])
  },
  render() {
    return html`<sl-dropdown slot="account-menu">
      <sl-button slot="trigger" caret loading size="small">
        <sl-icon name="person-fill"></sl-icon>
      </sl-button>
    </sl-dropdown>`
  },
}

export const renderers = [headerRenderer, headerLink, profileMenu]
export const viewers = [headerViewer]
