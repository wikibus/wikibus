import { css, html, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import type { Term } from '@rdfjs/types'
import { Menu, Search } from '../icons'
import CanvasShellBase from './CanvasShellBase'

const iconSize = 17

export class CanvasHeader extends CanvasShellBase(LitElement) {
  static get styles() {
    return css`
      ${super.styles || []}
      header {
        display: block;
      }
      
      #header-wrap {
        display: flex;
        height: 100%;
        height: 95px;
      }

      .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .spacer {
        flex: 1
      }

      #top-search {
        margin-top: 0;
        margin-bottom: 0;
        float: none;
      }

      #logo img {
        margin: 0;
      }

      slot[name="menu-link"]::slotted(a) {
        color: #cccccc !important;
        font-weight: bold;
        font-size: 13px;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-family: Raleway, sans-serif;
        transition: margin 0.4s ease 0s, padding 0.4s ease 0s;
        padding: 39px 15px;
      }

      slot[name="menu-link"]::slotted(a:hover) {
        color: var(--theme-color) !important;;
      }
      
      .break { 
        display: none;
      }

      #responsive-menu {
        display: flex;
      }

      #top-search button {
        color: #ccc;
      }

      #primary-menu-trigger {
        color: #ccc
      }

      @media only screen and (max-width: 991.98px) {
        .container {
          justify-content: space-between;
        }
        
        .spacer {
          display: none;
        }

        #logo {
          flex: 1;
          text-align: center;
          margin: 0;
        }
        
        #primary-menu {
          display: none;
        }
        
        #top-account {
          display: none;
        }
      }
    `
  }

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
            <div id="primary-menu-trigger" @click="${this.openMenu}" @keyup="${this.openMenu}">${Menu(iconSize)}</div>

            <div id="logo">
              <a href="/" class="standard-logo" data-dark-logo="images/logo-dark.png"
                ><img src="images/logo.png" alt="Wikibus Logo"
              /></a>
              <a href="/" class="retina-logo" data-dark-logo="images/logo-dark@2x.png"
                ><img src="images/logo@2x.png" alt="Wikibus Logo"
              /></a>
            </div>

            <div class="spacer"></div>

            <nav id="primary-menu">
              ${this.primaryMenuOpen ? '' : html`<slot name="menu-link"></slot>`}
            </nav>

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

            <div id="top-account">
              ${this.primaryMenuOpen ? '' : html`<slot name="account-menu"></slot>`}
            </div>
          </div>
        </div>
        <div id="responsive-menu" class="container clearfix">
          ${!this.primaryMenuOpen ? '' : html`<slot name="menu-link"></slot>`}
          <div style="flex: 1"></div>
          ${!this.primaryMenuOpen ? '' : html`<slot name="account-menu"></slot>`}
        </div>
      </header>
    `
  }

  openMenu() {
    this.primaryMenuOpen = !this.primaryMenuOpen
  }
}

customElements.define('canvas-header', CanvasHeader)
