import { html, Renderer } from '@hydrofoil/roadshow'
import { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import { hex } from '@hydrofoil/vocabularies/builders'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import { hyper_query as query } from '@hydrofoil/vocabularies/builders/strict'
import type { IriTemplate } from '@rdfine/hydra'
import { ShaperoneForm } from '@hydrofoil/shaperone-wc'
import { fromPointer } from '@rdfine/hydra/lib/Resource'
import { isGraphPointer, isResource } from 'is-graph-pointer'
import clownface, { GraphPointer } from 'clownface'
import $rdf from 'rdf-ext'

interface Locals {
  mappings?: GraphPointer
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

    const shape = searchable.search?.pointer.out(dash.shape).toArray().shift()
    const mappings = this.state.locals.mappings || cloneMappings(searchablePtr)
    this.state.locals.mappings = mappings

    return html`
      <div class="widget clearfix">
        <h4>${localizedLabel(shape)}</h4>
        <shaperone-form .shapes="${shape}" .resource="${mappings}">
          <canvas-button slot="buttons" 
                         @click="${submit(searchable.search)}" 
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

function cloneMappings(searchable: GraphPointer) {
  const original = searchable.out(query.templateMappings)
  if (isGraphPointer(original)) {
    return clownface({ dataset: cbd(original) }).node(original)
  }

  return clownface({ dataset: $rdf.dataset() }).blankNode()
}

function cbd(pointer: GraphPointer) {
  return pointer.dataset.match(pointer.term)
}
