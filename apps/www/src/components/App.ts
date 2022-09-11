/* eslint-disable class-methods-use-this */
import { connect } from '@captaincodeman/rdx'
import type { State } from '@hydrofoil/shell'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { ResourceLoader } from '@hydrofoil/roadshow/ResourcesController'
import { store } from '../state/store'
import CanvasShellBase from './canvas-shell/CanvasShellBase'
import './canvas-shell/canvas-page-menu'
import { wba } from '../lib/ns'
import ShapesLoaderMap from '../lib/ShapesLoaderMap'
import { renderers, viewers, decorators } from '../views'
import { resourceLoader } from '../lib/resourceLoader'
import './canvas-shell/canvas-icon-list'
import './AppNotifications'
import './canvas-shell/canvas-page-both-sidebars'

export default class App extends connect(store, CanvasShellBase(LitElement)) {
  __shapesLoaders?: ShapesLoaderMap
  __resourceLoader?: ResourceLoader

  @property({ type: Object })
  public state!: State

  static get styles() {
    return css`
      :host {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      
      #main {
        flex: 1 0 auto;
      }
      
      canvas-footer {
        flex-shrink: 0;
      }
    `
  }

  async connectedCallback() {
    store.dispatch.core.initialize()
    await import('./app-view')
    super.connectedCallback()
  }

  render() {
    if (this.state.core.contentResource && this.state.core.entrypoint) {
      return html`<app-view .resource="${this.state.core.contentResource.pointer}"
                            .shapesLoader="${this.__shapesLoaders?.get(wba.Content)}"
                            .resourceLoader="${this.__resourceLoader}"
                            .renderers="${renderers}"
                            .viewers="${viewers}"
                            .decorators="${decorators}"
                            .params="${this.state}"></app-view>
      
      <app-notifications></app-notifications>`
    }

    return html`
    `
  }

  mapState(state: State): Partial<App> {
    return {
      state,
      __shapesLoaders: state.core.client && new ShapesLoaderMap(state.core.client),
      __resourceLoader: this.__resourceLoader ||
        (state.core.client && resourceLoader(state.core.client)),
    }
  }

  mapEvents() {
    return {
      'submit-operation': ({ detail }: CustomEvent) => store.dispatch.operation.invoke(detail),
      'show-resource': ({ detail }: CustomEvent) => store.dispatch.routing.goTo(detail.id),
    }
  }
}
