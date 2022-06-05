import { Lazy, SingleEditorComponent, html } from '@hydrofoil/shaperone-wc'
import { dash, sh } from '@tpluscode/rdf-ns-builders/strict'
import { taggedLiteral } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'

export const textField: Lazy<SingleEditorComponent> = {
  editor: dash.TextFieldEditor,
  async lazyRender() {
    await import('@shoelace-style/shoelace/dist/components/input/input.js')

    return ({ property, value }, { update }) => html`<sl-input .value="${value.object?.value || ''}" 
                                                     label="${taggedLiteral(property.shape, { property: sh.name })}"
                                                     @sl-change="${(e: any) => update(e.target.value)}"></sl-input>`
  },
}
