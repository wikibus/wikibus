import { Decorator, html, PropertyViewContext } from '@hydrofoil/roadshow'
import { roadshow } from '@hydrofoil/vocabularies/builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel'
import { css, LitElement, PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators'
import { sh } from '@tpluscode/rdf-ns-builders'
import { canvas } from '../../lib/ns'

export const socialPostingDecorator: Decorator<PropertyViewContext> = {
  decorates: 'property',
  appliesTo(context): boolean {
    const decoratorIri = context.state.propertyShape.pointer.out(roadshow.decorator).term

    return decoratorIri?.equals(canvas.SocialPager) || false
  },
  decorate(inner, context) {
    return html`
      <canvas-social-slider>
        <h3 slot="header">${localizedLabel(context.state.propertyShape, { property: sh.name })}</h3>
        ${inner}
      </canvas-social-slider>
    `
  },
}

@customElement('canvas-social-slider')
export class Slider extends LitElement {
  static get styles() {
    return css`
      slot#main::slotted(*) {
        display: none;
      }
      
      [hidden] {
        display: none;
      }
    `
  }

  @property({ type: Number })
  public selected = 0

  @property({ type: Number })
  public total = 0

  @query('#main')
  private slotEl?: HTMLSlotElement

  async connectedCallback() {
    await import('../../components/canvas-shell/canvas-pager')
    super.connectedCallback?.()
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)

    this.updateVisibility()
  }

  render() {
    let pager = html``
    if (this.total > 1) {
      pager = html`<canvas-pager full-width pager-style="prev-next"
                                 .current="${this.selected}"
                                 .total="${this.total}"
                                 @current-changed="${this.selectPost}"></canvas-pager>`
    }

    return html`
      <slot ?hidden="${this.total === 0}" name="header"></slot>
      ${pager}
      <slot id="main" @slotchange="${this.updateTotal}"></slot>
    `
  }

  private selectPost(e: CustomEvent) {
    this.selected = e.detail.value
  }

  private updateTotal() {
    this.selected = 0
    this.total = this.slotEl?.assignedElements().length || 0
  }

  private updateVisibility() {
    this.slotEl?.assignedElements().forEach((slotted: HTMLElement | Element, index) => {
      if ('style' in slotted) {
        // eslint-disable-next-line no-param-reassign
        slotted.style.display = this.selected === index ? 'block' : ''
      }
    })
  }
}
