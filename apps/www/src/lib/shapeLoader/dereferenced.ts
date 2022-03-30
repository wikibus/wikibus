import type { NamedNode } from '@rdfjs/types'
import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import { dash, rdf, schema, sh } from '@tpluscode/rdf-ns-builders/strict'
import type { Collection, Resource } from 'alcaeus'
import { store } from '../../state/store'
import { byOrder } from '../shape'

const shapePromises = new Map<string, Promise<Collection | Resource | undefined | null>>()

function docs() {
  const { contentResource } = store.state.core
  if (contentResource) {
    if ('types' in contentResource) {
      return contentResource.apiDocumentation
    }

    const { id } = contentResource
    return store.state.resource.representations.get(id)?.root?.apiDocumentation
  }

  return undefined
}

export
async function dereferencedShapes(role: NamedNode, ...[arg, state]: Parameters<ShapesLoader>) {
  if (!store.state.core.client) {
    return []
  }

  if (!dash.DetailsViewer.equals(state.viewer)) {
    return []
  }

  const collections = docs()?.getCollections({
    predicate: rdf.type,
    object: sh.NodeShape,
  }) as Resource[] | undefined

  if (!collections?.length || arg.term?.termType !== 'NamedNode') {
    return []
  }

  const [shapesCollection] = collections
  // TODO: this could be improved in the future to actually dereference the collection
  // and check what query parameters are available
  const url = new URL(shapesCollection.get(schema.sameAs).id.value)
  url.searchParams.set('resource', arg.term.value)
  url.searchParams.set('role', role.value)

  const id = url.toString()
  let shapePromise = shapePromises.get(id)
  if (!shapePromise) {
    shapePromise = store.state.core.client.loadResource<Collection>(id)
      .then(({ representation }) => {
        shapePromises.delete(id)
        return representation?.root
      })
    shapePromises.set(id, shapePromise)
  }

  const shapes = await shapePromise
  if (shapes && 'member' in shapes) {
    return shapes.member.map(m => m.pointer).sort(byOrder)
  }

  return []
}
