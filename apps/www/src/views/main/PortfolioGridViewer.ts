import { html, MultiRenderer } from '@hydrofoil/roadshow'
import { hex } from '@hydrofoil/vocabularies/builders'
import { rdfs, schema } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { GraphPointer } from 'clownface'
import { byAnnotatedPaths } from '../../lib/collection'
import { canvas } from '../../lib/ns'

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

    const cols = this.state.propertyShape.getNumber(canvas.columns) || 'auto'
    const styles: Record<string, string | undefined> = {}
    styles['--portfolio-image-height'] = this.state.propertyShape.pointer.out(canvas.portfolioImageHeight).value
    styles['--portfolio-image-width'] = this.state.propertyShape.pointer.out(canvas.portfolioImageWidth).value

    return html`<masonry-layout class="grid-container clearfix" cols="${ifDefined(cols)}" style="${styleMap(styles)}">
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
