import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import CanvasShellBase from './CanvasShellBase'

@customElement('canvas-page-both-sidebars')
export class CanvasPageBothSidebars extends CanvasShellBase(LitElement) {
  render() {
    return html`<section id="content">
      <div class="content-wrap">
        <div class="container clearfix">
          <div class="row gutter-40 col-mb-80">
            <div class="sidebar col-lg-3">
              <slot name="left"></slot>
            </div>
            <div class="postcontent bothsidebar col-lg-6">
              <slot></slot>
            </div>
            <div class="sidebar col-lg-3">
              <slot name="right"></slot>
            </div>
          </div>
        </div>
      </div>
    </section>`
  }
}
