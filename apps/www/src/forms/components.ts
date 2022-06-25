import { SingleEditorComponent, html, Lazy } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders/loose'

export const TuiMarkdownComponent: Lazy<SingleEditorComponent> = {
  editor: dash.MarkdownEditor,
  async lazyRender() {
    await import('../components/TuiMarkdown')
    return (object, { update }) => html`<tui-markdown .value="${object.value.object?.value}" 
                                                      @change="${(e: CustomEvent) => update(e.detail.value)}"></tui-markdown>`
  },
}
