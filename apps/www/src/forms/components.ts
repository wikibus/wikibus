import { SingleEditorComponent, html, Lazy } from '@hydrofoil/shaperone-wc'
import { hex } from '@hydrofoil/vocabularies/builders'
import { schema } from '@tpluscode/rdf-ns-builders'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { wba } from '@wikibus/core/ns'
import { isBlankNode, isNamedNode } from 'is-graph-pointer'
import '@hydrofoil/shaperone-wc/renderer'
import $rdf from 'rdf-ext'
import { GraphPointer } from 'clownface'
import { store } from '../state/store'
import { canvas } from '../lib/ns'

export const TuiMarkdownComponent: Lazy<SingleEditorComponent> = {
  editor: dash.MarkdownEditor,
  async lazyRender() {
    await import('../components/TuiMarkdown')
    return (object, { update }) => html`<tui-markdown .value="${object.value.object?.value}" 
                                                      @change="${(e: CustomEvent) => update(e.detail.value)}"></tui-markdown>`
  },
}

export const FileUploadEditorComponent: Lazy<SingleEditorComponent> = {
  editor: wba.FileUploadEditor,
  init({ property, value, componentState, updateComponentState }) {
    const { loadOperation } = componentState
    const { client } = store.state.core

    if (typeof loadOperation === 'undefined' && client) {
      updateComponentState({
        loadOperation: (async () => {
          const fileUploadCollection = value.overrides?.out(hex.fileUploadCollection) ||
            property.shape.pointer.out(hex.fileUploadCollection)
          if (!isNamedNode(fileUploadCollection)) {
            return
          }

          const { representation } = await client.loadResource(fileUploadCollection.term) || {}

          updateComponentState({
            operation: representation?.root?.findOperations({
              bySupportedOperation: schema.CreateAction,
            }).shift(),
          })
        })(),
      })
    }

    return true
  },
  async lazyRender() {
    await import('../components/FileUpload')
    return ({ componentState }, { update }) => html`<canvas-file-upload
      .uploadOperation="${componentState.operation}"
      @uploaded="${(e: CustomEvent) => { update($rdf.namedNode(e.detail.created)) }}"></canvas-file-upload>`
  },
}

interface ImageFormPreview {
  image?: string
  loadOperation?: Promise<void>
}

export const ImageFormPreviewComponent: SingleEditorComponent<ImageFormPreview> = {
  editor: canvas.ImageFormPreview,
  init({ value, componentState, updateComponentState }) {
    const { loadOperation } = componentState
    const { client } = store.state.core

    if (!loadOperation && client) {
      updateComponentState({
        loadOperation: (async () => {
          if (!client) {
            return
          }

          let pointer: GraphPointer | undefined
          if (isNamedNode(value.object)) {
            const { representation } = await client.loadResource(value.object.term)
            pointer = representation?.root?.pointer
          } else if (isBlankNode(value.object)) {
            pointer = value.object
          }

          const thumbnail = pointer?.out(schema.thumbnail).out(schema.contentUrl).value
          const contentUrl = pointer?.out(schema.contentUrl).value

          updateComponentState({
            image: thumbnail || contentUrl || '',
          })
        })(),
      })
    }

    return true
  },
  render({ renderer, value }) {
    if (typeof value.componentState.image !== 'string') {
      return renderer.context.templates.component.loading()
    }

    return html`<image alt="Resource depiction" src="${value.componentState.image}"></image>`
  },
}
