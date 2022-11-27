import { LitElement, html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import type { RuntimeOperation } from 'alcaeus'

@customElement('canvas-file-upload')
export class FileUpload extends LitElement {
  static get styles() {
    return css`
      #input {
        visibility: hidden;
      }
    `
  }

  @property({ type: Object })
  public uploadOperation?: RuntimeOperation

  @property({ type: Boolean, reflect: true, attribute: 'uploading' })
  private _uploading = false

  @query('#input')
  private __input!: HTMLInputElement

  render() {
    return html`
      <sl-button ?disabled="${!this.uploadOperation || this._uploading}"
                 ?loading="${this._uploading}"
                 @click="${() => this.__input.click()}">
        Select file
      </sl-button>
      <input id="input" type="file" @change="${this.__upload}">
    `
  }

  async __upload() {
    this._uploading = true
    try {
      const { response } = await this.uploadOperation?.invoke(this.__input.files![0]) || {}

      const created = response?.xhr.headers.get('Location')

      if (created) {
        this.dispatchEvent(new CustomEvent('uploaded', {
          bubbles: true,
          composed: true,
          detail: { created },
        }))
      }
    } finally {
      this._uploading = false
    }
  }
}
