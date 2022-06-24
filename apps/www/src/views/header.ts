import { html, FocusNodeViewContext, Renderer, ObjectViewContext, ViewerMatcher } from '@hydrofoil/roadshow'
import { dash, acl, rdf, schema } from '@tpluscode/rdf-ns-builders'
import { hex } from '@hydrofoil/vocabularies/builders'
import { GraphPointer } from 'clownface'
import { isNamedNode } from 'is-graph-pointer'
import { store } from '../state/store'

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

interface AuthStatus {
  loading?: boolean
  userPromise?: Promise<void>
  user?: GraphPointer
}

const profileMenu: Renderer<FocusNodeViewContext<AuthStatus>> = {
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
  render(ptr) {
    const { loading, user } = this.state.locals
    if (typeof loading === 'undefined') {
      if (isNamedNode(ptr)) {
        this.state.locals.loading = true
        this.state.locals.userPromise = this.controller.resources.load(ptr.term)
          .then((loaded) => {
            if (loaded) {
              this.state.locals.user = loaded
            }
            this.state.locals.loading = false
            this.controller.host.requestUpdate()
          })
      } else {
        this.state.locals.loading = false
      }
      this.controller.host.requestUpdate()
    }

    const isAuthenticated = !!user?.has(rdf.type, acl.AuthenticatedAgent).terms.length

    return html`<sl-dropdown slot="account-menu" placement="bottom-end">
      <sl-button slot="trigger" caret ?loading="${loading}" size="small">
        <sl-icon name="person-fill"></sl-icon>
      </sl-button>
      <sl-menu @sl-select="${accountMenuSelected}">
        <sl-menu-item ?hidden="${isAuthenticated}" value="log-in">Log in</sl-menu-item>
        <sl-menu-item ?hidden="${!isAuthenticated}" value="logout">Log out</sl-menu-item>
      </sl-menu>
    </sl-dropdown>`
  },
}

function accountMenuSelected(e: any) {
  switch (e.detail.item.value) {
    case 'log-in':
      store.dispatch.auth.logIn({})
      break
    case 'log-out':
      store.dispatch.auth.logOut()
      break
    default:
      // eslint-disable-next-line no-console
      console.warn(`Unexpected ${e.detail.item.value}`)
  }
}

export const renderers = [headerRenderer, headerLink, profileMenu]
export const viewers = [headerViewer]
