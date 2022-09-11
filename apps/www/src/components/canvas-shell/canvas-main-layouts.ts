import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import CanvasShellBase from './CanvasShellBase'

@customElement('canvas-main-content')
export class CanvasMainContent extends CanvasShellBase(LitElement) {
  static get styles() {
    return [
      super.styles || [],
      css`
        .sidebar {
          display: none;
        }
        
        :host([right-sidebar]) .right {
          display: block;
        }
        
        :host([left-sidebar]) .left {
          display: block;
        }
      `,
    ]
  }

  @property({ type: Boolean, attribute: 'left-sidebar' })
  public leftSidebar = false

  @property({ type: Boolean, attribute: 'right-sidebar' })
  public rightSidebar = false

  render() {
    const mainClasses = {
      bothsidebar: this.leftSidebar && this.rightSidebar,
      'col-lg-6': this.leftSidebar && this.rightSidebar,
      'col-lg-9': this.leftSidebar || this.rightSidebar,
      'order-lg-last': this.leftSidebar && !this.rightSidebar,
    }

    return html`
      <section id="content">
        <div class="content-wrap">
          <div class="container clearfix">
            <div class="row gutter-40 col-mb-80">
              <div class="left sidebar col-lg-3">
                <div class="sidebar-widgets-wrap">
                  <slot name="left"></slot>
                </div>
              </div>
              <div class="postcontent ${classMap(mainClasses)}">
                <slot></slot>
              </div>
              <div class="right sidebar col-lg-3">
                <div class="sidebar-widgets-wrap">
                  <slot name="right"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`
  }
}
