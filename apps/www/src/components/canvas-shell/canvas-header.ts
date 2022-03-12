import { html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import type { Term } from '@rdfjs/types'
import { Menu, Search } from '../icons'
import CanvasShellBase from './CanvasShellBase'

const iconSize = 17

export class CanvasHeader extends CanvasShellBase(LitElement) {
  @property({ type: Boolean })
  public topSearchOpen = false

  @property({ type: Boolean })
  public primaryMenuOpen = false

  @property({ type: Object })
  public home!: Term

  public render() {
    return html`
      <header
        id="header"
        ?search-open="${this.topSearchOpen}"
        ?primary-menu-open="${this.primaryMenuOpen}"
      >
        <div id="header-wrap">
          <div class="container clearfix">
            <div id="primary-menu-trigger">${Menu(iconSize)}</div>

            <div id="logo">
              <a href="/" class="standard-logo" data-dark-logo="images/logo-dark.png"
                ><img src="images/logo.png" alt="Wikibus Logo"
              /></a>
              <a href="/" class="retina-logo" data-dark-logo="images/logo-dark@2x.png"
                ><img src="images/logo@2x.png" alt="Wikibus Logo"
              /></a>
            </div>

            <div id="top-account">
              <!-- account menu -->
            </div>

            <nav id="primary-menu">
              <ul>
                <!-- primary menu -->
              </ul>

              <div id="top-search">
                <button id="top-search-trigger"> ${Search(iconSize)}</button>
                <form method="GET">
                  <input
                    type="text"
                    name="title"
                    class="form-control"
                    value=""
                    placeholder="Type &amp; Hit Enter.."
                  />
                </form>
              </div>
            </nav>
          </div>
        </div>
      </header>
    `
  }
}

customElements.define('canvas-header', CanvasHeader)
