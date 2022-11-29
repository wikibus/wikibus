import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators'
import type { Shape } from '@rdfine/shacl'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel'
import { sh } from '@tpluscode/rdf-ns-builders'
import { GraphPointer } from 'clownface'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

@customElement('sh-sl-add-object-buttons')
export class ShSlAddObjectButtons extends LitElement {
  static get styles() {
    return css`
      sl-button {
        margin-right: 20px;
      }`
  }

  @property({ type: Array })
  public shapes: Array<Shape> = []

  render() {
    return html`${this.shapes.map(alt => html`
      <sl-button @click="${this._addObject(alt.pointer)}">
        <sl-icon slot="prefix" name="plus"></sl-icon>
        ${localizedLabel(alt.pointer, { property: [sh.name] })}
      </sl-button>`)}`
  }

  _addObject(overrides: GraphPointer) {
    return () => {
      this.dispatchEvent(new CustomEvent('added', {
        detail: {
          overrides,
        },
        bubbles: true,
        composed: true,
      }))
    }
  }
}
