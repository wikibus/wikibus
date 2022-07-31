import type { Renderer, ViewerMatcher } from '@hydrofoil/roadshow'
import { DetailsViewer } from '@hydrofoil/roadshow/viewers'
import { dash } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import type { FocusNodeViewContext } from '@hydrofoil/roadshow/lib/ViewContext'
import TermMap from '@rdfjs/term-map'
import type { Term } from '@rdfjs/types'
import { PropertyState } from '@hydrofoil/roadshow/lib/state'
import $rdf from '@rdfjs/data-model'
import type { PropertyGroup } from '@rdfine/shacl'
import { byOrder } from '../../lib/shape'
import { wrapper } from '../wrapper'

export const matcher: ViewerMatcher = {
  viewer: dash.DetailsViewer,
  match(...args) {
    return DetailsViewer.match(...args) === null ? 50 : 0
  },
}

interface GroupedProperties {
  group: PropertyGroup | undefined
  order: number
  properties: PropertyState[]
}

export const renderer: Renderer<FocusNodeViewContext> = {
  viewer: dash.DetailsViewer,
  render() {
    const groups = this.state.properties.reduce((previous, property) => {
      const { group } = property.propertyShape
      const groupId = group?.id || $rdf.blankNode('default')
      const order = property.propertyShape.group?.order
      const next: GroupedProperties = previous.get(groupId) || {
        group,
        order: typeof order === 'undefined' ? 100 : order,
        properties: [],
      }

      next.properties.push(property)
      return previous.set(groupId, next)
    }, new TermMap<Term, GroupedProperties>())

    const groupOrdered = [...groups.values()].sort(byOrder)

    return html`${groupOrdered.map(({ group, properties }) => {
      const visibleProps = (properties || []).sort(byOrder)
        .filter(({ propertyShape }) => !propertyShape.hidden)

      if (visibleProps.length === 0) {
        return ''
      }

      const contents = html`${visibleProps.map(property => this.show({ property }))}`

      if (!group) {
        return contents
      }

      return html`${wrapper(group, contents)}`
    })}`
  },
}
