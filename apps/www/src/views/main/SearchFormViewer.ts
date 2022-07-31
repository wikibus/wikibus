import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import { hyper_query as query } from '@hydrofoil/vocabularies/builders/strict'
import type { IriTemplate } from '@rdfine/hydra'
import { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import { fromPointer } from '@rdfine/hydra/lib/Resource'
import { isResource } from 'is-graph-pointer'

interface Locals {
  template?: IriTemplate
  templateLoaded?: boolean
  templateLoading?: boolean
}

export const renderer: Renderer<FocusNodeViewContext<Locals>> = {
  viewer: hex.SearchFormViewer,
  async init() {
    await import('../../components/canvas-shell/canvas-button')
    await import('@hydrofoil/shaperone-wc/shaperone-form.js')
  },
  render(searchPointer) {
    const searchablePtr = searchPointer.in(hydra.search)
    if (!isResource(searchablePtr)) {
      return ''
    }
    const searchable = fromPointer(searchablePtr, {}, {
      factory: this.params.core.client?.resources.factory,
    })

    this.state.locals.template = this.state.locals.template || searchable.search
    const { template } = this.state.locals

    const shape = template?.pointer.out(dash.shape).toArray().shift()

    // TODO: it should be somehow natively supported to exclude paging properties for mappings
    const mappings = searchablePtr
      .out(query.templateMappings)
      .deleteOut(hydra.pageIndex)

    return html`
      <div class="widget clearfix">
        <h4>${localizedLabel(shape)}</h4>
        <shaperone-form .shapes="${shape}" .resource="${mappings}">
          <canvas-button slot="buttons" 
                         @click="${submit(template)}" 
                         label="Search"></canvas-button>
        </shaperone-form>
      </div>
    `
  },
}

function submit(template: IriTemplate | undefined) {
  return (e: any) => {
    const form = e.target.parentElement as ShaperoneForm
    if (template && form.value) {
      const id = template.expand(form.value)
      form.dispatchEvent(new CustomEvent('show-resource', {
        bubbles: true,
        composed: true,
        detail: { id },
      }))
    }
  }
}
