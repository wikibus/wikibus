/* eslint-disable class-methods-use-this */
import { connect } from '@captaincodeman/rdx'
import type { State } from '@hydrofoil/shell'
import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { store } from '../state/store'
import CanvasShellBase from './canvas-shell/CanvasShellBase'
import './canvas-shell/canvas-header.ts'
import './canvas-shell/canvas-footer.ts'
import './canvas-shell/canvas-gototop.ts'

export default class extends connect(store, CanvasShellBase(LitElement)) {
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
    await import('@hydrofoil/roadshow/roadshow-view.js')
    super.connectedCallback()
  }

  render() {
    const view = this.state.core.contentResource
      ? html`<roadshow-view .resource="${this.state.core.contentResource.pointer}" .params="${this.state}"></roadshow-view>`
      : ''

    return html`
      <canvas-header></canvas-header>

      <section id="main">${view}</section>

      <canvas-footer></canvas-footer>
      <canvas-gototop></canvas-gototop>
    `
  }

  mapState(state: State) {
    return {
      state,
    }
  }
}
