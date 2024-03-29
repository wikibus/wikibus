import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { render } from 'lit'
import type { NodeShape } from '@rdfine/shacl'
import type { RdfResource, RuntimeOperation } from 'alcaeus'
import { GraphPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'
import type { Dialog } from '@vaadin/vaadin-dialog/vaadin-dialog'
import { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import { guard } from 'lit/directives/guard.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { store } from '../../state/store'

interface Locals {
  open?: boolean
  shape?: NodeShape
  operation?: RuntimeOperation
}

function loadShape(operation: RuntimeOperation): Promise<NodeShape> {
  return new Promise((resolve, reject) => {
    const { expects } = operation
    const shapeId = expects[0]?.id

    store.state.core.client?.loadResource<NodeShape>(`${shapeId.value}`)
      .then(({ representation }) => representation?.root)
      .then((root) => {
        if (root) {
          resolve(root)
        } else {
          reject()
        }
      })
  })
}

function getOperation(context: FocusNodeViewContext<Locals>, pointer: GraphPointer) {
  let operationType = context.state.shape?.pointer.out(hex.operation).term
  if (!operationType) {
    operationType = context.parent?.propertyShape.pointer.out(hex.operation).term
  }

  let resource: RdfResource | undefined
  if ('types' in store.state.core.contentResource!) {
    resource = store.state.core.client?.resources.factory.createEntity<RdfResource>(pointer as any)
  } else {
    const rootResource = store.state.core.client?.resources.get(
      store.state.core.contentResource!.id as NamedNode,
    )
    resource = rootResource?.representation.get(pointer.value, { allObjects: true })
  }

  const [operation] = resource?.findOperations({
    bySupportedOperation: operationType as any,
  }) || []

  return operation
}

export const renderer: Renderer<FocusNodeViewContext<Locals>> = {
  viewer: hex.OperationFormDialogViewer,
  async init() {
    /* eslint-disable import/no-extraneous-dependencies */
    await import('@vaadin/vaadin-dialog/vaadin-dialog.js')
    await import('@shoelace-style/shoelace/dist/components/spinner/spinner.js')
    await import('../../components/canvas-shell/canvas-button')
  },
  render(pointer) {
    this.state.locals.operation = this.state.locals.operation || getOperation(this, pointer as any)

    const { operation, shape } = this.state.locals
    if (!operation) {
      return ''
    }
    const operationState = this.params.operation.operations.get(operation.id)

    const openDialog = (e: Event) => {
      this.state.locals.open = true
      if (!this.state.locals.shape) {
        loadShape(operation)
          .then((loaded) => {
            this.state.locals.shape = loaded
            this.controller.host.requestUpdate()
          })
          .catch(() => {
            // eslint-disable-next-line no-console
            console.log('Failed to load shape')
          })
      }

      this.controller.host.requestUpdate()
      e.preventDefault()
    }
    const closeDialog = (e: any) => {
      this.state.locals.open = e.detail.value
      delete this.state.locals.shape
      this.controller.host.requestUpdate()
    }

    async function renderForm(this: Dialog, root: HTMLElement) {
      await import('@hydrofoil/shaperone-wc/shaperone-form.js')
      render(html`<shaperone-form .shapes="${shape?.pointer}"></shaperone-form>`, root)
    }

    function renderFooter(this: Dialog, root: HTMLElement) {
      render(html`
        ${operationState?.loading ? html`<sl-spinner></sl-spinner>` : ''}
        <canvas-button slot="buttons"
                       @click="${submit(this, root, operation)}"
                       .label="${operation.title}"
                       ?disabled="${operationState?.loading || false}"
        ></canvas-button>`, root)
    }

    return html`
      <li><button @click="${openDialog}">${localizedLabel(this.parent?.propertyShape, { property: sh.name })}</button>
      <vaadin-dialog .opened="${this.state.locals.open || false}"
                     header-title="${localizedLabel(shape) as any}"
                     .renderer="${guard([operation, shape], () => renderForm)}"
                     .footerRenderer="${guard([operationState?.loading], () => renderFooter)}"
                     @opened-changed="${closeDialog}"
      ></vaadin-dialog>
      </li>
    `
  },
}

function submit(dialog: Dialog, root: HTMLElement, operation: RuntimeOperation) {
  return () => {
    const form: ShaperoneForm | null | undefined = root.parentElement?.querySelector('shaperone-form')

    dialog.dispatchEvent(new CustomEvent('submit-operation', {
      bubbles: true,
      composed: true,
      detail: {
        operation,
        payload: form?.resource,
      },
    }))
  }
}
