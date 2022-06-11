import { Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders/strict'
import type { ComponentInstance } from '@hydrofoil/shaperone-core/models/components'

interface EditorState extends ComponentInstance {
  noLabel?: boolean
}

export const textField: Lazy<SingleEditorComponent<EditorState>> = {
  editor: dash.TextFieldEditor,
  async lazyRender() {
    const { inputRenderer } = await import('./renderer/input')

    return inputRenderer()
  },
}

export const uri: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  async lazyRender() {
    const { inputRenderer } = await import('./renderer/input')

    return inputRenderer({ type: 'url' })
  },
}
