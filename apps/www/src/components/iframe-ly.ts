import { css, html, LitElement } from 'lit'
import { iframely } from '@iframely/embed.js'
import { property, query } from 'lit/decorators'
import { ifDefined } from 'lit/directives/if-defined'

const frames = new Set<HTMLIFrameElement>()
const { findIframe } = iframely

iframely.findIframe = (arg: any) => {
  const found = [...frames].find(frame => arg.src === frame.src)
  return found || findIframe(arg)
}

iframely.on('iframe-ready', (frame: HTMLIFrameElement) => frames.add(frame))

// this obviously sucks given how it's global state
// but I don't expect mutltiple API keys would be used on a single page
iframely.extendOptions({ key: '184e58ce3a000bd330b086e9a34d5c38' })

class IframelyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }
      
      .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }
      
      .overlay {
        position: absolute;
        text-align: center;
        z-index: 1;
        width: 100%;
        height: 100%;
      }
      
      :host([loaded]) .wrapper {
        display: none;
      }
      
      :host([loaded]) .iframely-embed {
        display: block;
      }

      .iframely-responsive {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
      }
     
      .iframely-responsive > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
    `
  }

  @property({ type: String })
  public href?: string

  @property({ type: Boolean, reflect: true })
  public loaded?: boolean

  @property({ type: Boolean })
  public header?: boolean

  @property({ type: Boolean })
  public footer?: boolean

  @property({ type: Boolean, attribute: 'hide-text' })
  public hideText?: boolean

  @query('iframe')
  public frame!: HTMLIFrameElement

  render() {
    /* eslint-disable lit-a11y/anchor-has-content */
    return html`
      <div class="wrapper">
        <div class="overlay">
          <slot></slot>
        </div>
      </div>
      <div class="iframely-embed">
        <div class="iframely-responsive">
          <a href="${ifDefined(this.href)}">
          </a>
        </div>
      </div>`
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    frames.delete(this.frame)
  }

  firstUpdated() {
    const link = this.renderRoot.querySelector('a')
    if (link) {
      onVisible(this, () => {
        iframely.load(link)

        const src = new URL(this.frame.src)

        if (this.header) {
          src.searchParams.set('_header', 'true')
        }

        if (this.footer) {
          src.searchParams.set('_footer', 'true')
        }

        if (this.hideText) {
          src.searchParams.set('_hide_text', 'true')
        }

        this.frame.src = src.toString()
        this.frame.onload = () => {
          this.loaded = true
        }
      })
    }
  }
}

function onVisible(element: HTMLElement, callback: () => void) {
  new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        callback()
        observer.disconnect()
      }
    })
  }).observe(element)
}

customElements.define('iframe-ly', IframelyElement)
