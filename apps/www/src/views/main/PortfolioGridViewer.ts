import { html, MultiRenderer } from '@hydrofoil/roadshow'
import { hex } from '@hydrofoil/vocabularies/builders'
import { rdfs, schema } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit/directives/repeat.js'
import { GraphPointer } from 'clownface'
import { byAnnotatedPaths } from '../../lib/collection'

export const renderer: MultiRenderer = {
  viewer: hex.CollectionMembersViewer,
  meta(ptr) {
    ptr.addOut(rdfs.label, 'Image gallery')
  },
  async init() {
    await import('@appnest/masonry-layout')
    await import('../../components/canvas-shell/canvas-portfolio-item')
  },
  render(members) {
    const collection = this.parent?.pointer

    return html`<masonry-layout class="grid-container clearfix">
      ${repeat(members.toArray().sort(byAnnotatedPaths(collection)), member => member.value, renderMember(this.state.propertyShape.pointer))}
    </masonry-layout>`
  },
}

function renderMember(shape: GraphPointer) {
  const titlePath = shape.out(hex.titlePath)
  return (member: GraphPointer) => {
    const image = member.out(schema.image).out(schema.contentUrl)

    return html`<canvas-portfolio-item .resource="${member}" .image="${image}" .titlePath="${titlePath}"></canvas-portfolio-item>`
  }
}
