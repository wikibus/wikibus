/* eslint-disable class-methods-use-this */
import { connect } from '@captaincodeman/rdx'
import type { State } from '@hydrofoil/shell'
import { css, html, LitElement, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { store } from '../state/store'
import CanvasShellBase from './canvas-shell/CanvasShellBase'
import './canvas-shell/canvas-header.ts'
import './canvas-shell/canvas-footer.ts'
import './canvas-shell/canvas-gototop.ts'
import { wba } from '../lib/ns'
import ShapesLoaderMap from '../lib/ShapesLoaderMap'
import * as Header from '../views/header'
import * as Main from '../views/main'

export default class App extends connect(store, CanvasShellBase(LitElement)) {
  __shapesLoaders?: ShapesLoaderMap

  @property({ type: Object })
    state!: State

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
    let main: TemplateResult = html``
    let header: TemplateResult = Header.renderHeader()

    if (this.state.core.contentResource) {
      header = html`<app-view .resource="${this.state.core.entrypoint}"
                              .shapesLoader="${this.__shapesLoaders?.get(wba.MainMenu)}"
                              .renderers="${Header.renderers}"
                              .viewers="${Header.viewers}"
                              .params="${this.state}"></app-view>`
      main = html`<app-view .resource="${this.state.core.contentResource.pointer}"
                            .shapesLoader="${this.__shapesLoaders?.get(wba.Content)}"
                            .renderers="${Main.renderers}"
                            .viewers="${Main.viewers}"
                            .decorators="${Main.decorators}"
                            .params="${this.state}"></app-view>`
    }

    return html`
      ${header}

      <section id="main">${main}</section>

      <canvas-footer></canvas-footer>
      <canvas-gototop></canvas-gototop>
    `
  }

  mapState(state: State): Partial<App> {
    return {
      state,
      __shapesLoaders: state.core.client && new ShapesLoaderMap(state.core.client),
    }
  }
}
