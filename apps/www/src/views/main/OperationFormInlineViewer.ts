import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import type { NodeShape } from '@rdfine/shacl'
import type { RdfResource, RuntimeOperation } from 'alcaeus'
import { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import clownface, { GraphPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { store } from '../../state/store'

interface Locals {
  shape?: NodeShape
  operation?: RuntimeOperation
  resource?: GraphPointer
  loading?: Promise<void>
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

function getOperation(context: FocusNodeViewContext<Locals>, resource: RdfResource) {
  let operationType = context.state.shape?.pointer.out(hex.operation).term
  if (!operationType) {
    operationType = context.parent?.propertyShape.pointer.out(hex.operation).term
  }

  const [operation] = resource?.findOperations({
    bySupportedOperation: operationType as any,
  }) || []

  return operation
}

export const renderer: Renderer<FocusNodeViewContext<Locals>> = {
  viewer: hex.OperationFormInlineViewer,
  async init() {
    await import('../../components/canvas-shell/canvas-button')
    await import('@hydrofoil/shaperone-wc/shaperone-form.js')
  },
  render(pointer) {
    if (!this.state.locals.loading) {
      this.state.locals.loading = this.params.core.client?.loadResource(pointer.value!, {
        Prefer: 'return=minimal',
      })
        .then(({ representation }) => representation?.root)
        .then((resource) => {
          if (resource) {
            const dataset = $rdf.dataset([...resource.pointer.dataset])
              .match(null, null, null, resource.id)
              .map(({ subject, predicate, object }) => $rdf.quad(subject, predicate, object))
            this.state.locals.resource = clownface({
              dataset, term: resource.id,
            })
            this.state.locals.operation = getOperation(this, resource)
          }
          this.controller.host.requestUpdate()
        })
      return ''
    }

    const { operation, shape, resource } = this.state.locals
    if (!operation) {
      return ''
    }

    if (!shape) {
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

    return html`
      <shaperone-form .shapes="${shape?.pointer}" .resource="${resource}">
        <canvas-button slot="buttons" @click="${submit(operation)}" .label="${operation.title}"></canvas-button>
      </shaperone-form>
    `
  },
}

function submit(operation: RuntimeOperation) {
  return (e: any) => {
    const form: ShaperoneForm = e.target?.parentElement

    form.dispatchEvent(new CustomEvent('submit-operation', {
      bubbles: true,
      composed: true,
      detail: {
        operation,
        payload: form.resource,
      },
    }))
  }
}