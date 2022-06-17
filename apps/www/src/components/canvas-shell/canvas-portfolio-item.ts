import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { GraphPointer } from 'clownface'
import { taggedLiteral } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'
import { skos } from '@tpluscode/rdf-ns-builders'
import { schema } from '@tpluscode/rdf-ns-builders/strict'
import CanvasShellBase from './CanvasShellBase'

@customElement('canvas-portfolio-item')
export class CanvasPortfolioItem extends CanvasShellBase(LitElement) {
  static get styles() {
    return [super.styles || [], css`
      :host {
        display: block;
      }
      
      .portfolio-image {
        position: relative;
        height: 200px;
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .portfolio-image img {
        max-width: 300px;
        max-height: 200px;
      }
      
      .portfolio-overlay {
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .portfolio-overlay a {
        background-color: rgb(245, 245, 245);
        font-size: 18px;
        line-height: 40px;
        color: rgb(68, 68, 68);
        border-radius: 50%;
        backface-visibility: hidden;
        width: 40px;
        height: 40px;
      }

      .portfolio-image:hover .portfolio-overlay {
        pointer-events: all;
        opacity: 1;
      }
    `]
  }

  @property({ type: Object })
  public image?: GraphPointer

  @property({ type: Object })
  public resource!: GraphPointer

  render() {
    return html`
      <div class="portfolio-image">
        <a href="${this.resource.value}">
          ${this.renderImage()}
        </a>

        <div class="portfolio-overlay">
          <a href="${this.resource.value}">
            <i class="icon-line-ellipsis"></i>
          </a>
        </div>

      </div>

      <div class="portfolio-desc">
        <h3><a href="${this.resource.value}">${taggedLiteral(this.resource, { property: skos.prefLabel })}</a></h3>
      </div>
    `
  }

  renderImage() {
    /* eslint-disable lit/no-invalid-html */
    const imageUrl = this.resource.out(schema.image).out(schema.contentUrl).value
    return imageUrl
      ? html`<img src="${imageUrl}" alt="${taggedLiteral(this.resource, { property: skos.prefLabel })} Logo">`
      : html`<img src="https://dummyimage.com/300x200/e0e0e0/64bfdb&amp;text=${taggedLiteral(this.resource, { property: skos.prefLabel })}"
                alt="${taggedLiteral(this.resource, { property: skos.prefLabel })} Logo">`
  }
}
