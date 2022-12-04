import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import onetime from 'onetime'
import { isNamedNode } from 'is-graph-pointer'

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: hex.CommentsViewer,
  init: onetime(async () => {
    const script = document.createElement('script')
    script.src = 'https://talk.hyvor.com/embed/embed.js'
    script.crossOrigin = 'anonymous'

    document.head.appendChild(script)
  }),
  render(pointer) {
    if (!isNamedNode(pointer)) {
      return html`Comments context must be a resource`
    }

    return html`<hyvor-talk-comments
      website-id="596"
      page-id="${pointer.value}"
      page-title="${document.title}"
      style="--ht-color-accent: var(--theme-color);"
    ></hyvor-talk-comments>`
  },
}
