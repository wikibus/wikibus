import { css, html, LitElement, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import Editor from '@toast-ui/editor'
import styles from '@toast-ui/editor/dist/toastui-editor.css'

@customElement('tui-markdown')
export class TuiMarkdown extends LitElement {
  @property({ type: String })
  public value: string | undefined = ''

  private editor?: Editor

  static get styles() {
    return css`${unsafeCSS(styles)}`
  }

  protected firstUpdated() {
    this.editor = new Editor({
      el: this.renderRoot.querySelector('div')!,
      initialEditType: 'markdown',
      initialValue: this.value,
      previewStyle: 'tab',
      usageStatistics: false,
      events: {
        blur: () => {
          this.dispatchEvent(new CustomEvent('change', {
            detail: {
              value: this.editor?.getMarkdown(),
            },
          }))
        },
      },
    })
  }

  protected render(): unknown {
    return html`<div></div>`
  }
}
