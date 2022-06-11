import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import CanvasShellBase from './CanvasShellBase'

@customElement('canvas-page-menu')
export class CanvasPageMenu extends CanvasShellBase(LitElement) {
  connectedCallback() {
    super.connectedCallback?.()
    this.id = 'page-menu'
  }

  render() {
    return html`
      <div id="page-menu">
        <div id="page-menu-wrap">
          <div class="container">
            <div class="page-menu-row">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>`
  }
}
