import { html, LitElement } from 'lit'
import './canvas-shell/canvas-pager'
import { customElement, property } from 'lit/decorators.js'

@customElement('facebook-post-slider')
export class FacebookPostSlider extends LitElement {
  @property({ type: Number })
  public current = 0

  links: string[] = []

  render() {
    let pager = html``
    if (this.links.length > 1) {
      pager = html`<canvas-pager full-width 
                                 .current="${this.current}"
                                 .total="${this.links.length}"
                                 @current-changed="${this.selectPost}"></canvas-pager>`
    }

    const link = this.links[this.current]
    if (!link) {
      return pager
    }

    const embedUrl = new URL('https://www.facebook.com/plugins/post.php')
    embedUrl.searchParams.set('href', link)
    embedUrl.searchParams.set('appId', '178149006629319')
    embedUrl.searchParams.set('width', 'auto')

    return html`
      <h3>On Facebook</h3>
      
      ${pager}

      <iframe title="Facebook post" height="800"
              src="${embedUrl.toString()}"
              style="width: 100%;border:none;overflow:hidden" scrolling="no" frameborder="0" allow="fullscreen autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
    `
  }

  selectPost(e: CustomEvent) {
    this.current = e.detail.value
  }
}
