import { html, MultiRenderer } from '@hydrofoil/roadshow'
import { hex } from '@hydrofoil/vocabularies/builders'
import { rdfs, schema } from '@tpluscode/rdf-ns-builders/strict'
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
      ${repeat(members.toArray().sort(byAnnotatedPaths(collection)), member => member.value, renderMember)}
    </masonry-layout>`
  },
}

function renderMember(member: GraphPointer) {
  const image = member.out(schema.image).out(schema.contentUrl)

  return html`<canvas-portfolio-item .resource="${member}" .image="${image}"></canvas-portfolio-item>`
}
