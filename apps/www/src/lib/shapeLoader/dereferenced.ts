import type { NamedNode, Term } from '@rdfjs/types'
import { ShapesLoader } from '@hydrofoil/roadshow/ShapesController'
import { dash, rdf, sh } from '@tpluscode/rdf-ns-builders'
import type { Collection, Resource } from 'alcaeus'
import type { HydraClient } from 'alcaeus/alcaeus'
import { isNamedNode } from 'is-graph-pointer'
import clownface, { GraphPointer } from 'clownface'
import $rdf from 'rdf-ext'
import TermMap from '@rdfjs/term-map'
import { store } from '../../state/store'
import { byOrder } from '../shape'

const shapePromises = new Map<string, Promise<Collection | Resource | undefined | null>>()

const shapeCollections = new TermMap<Term, Resource | undefined>()
async function getCollection(entrypoint: GraphPointer | undefined, client: HydraClient) {
  if (!isNamedNode(entrypoint)) {
    return undefined
  }
  if (!shapeCollections.has(entrypoint.term)) {
    const { representation } = await client.loadResource(entrypoint.term)
    shapeCollections.set(entrypoint.term, representation?.root?.getCollections({
      predicate: rdf.type,
      object: sh.NodeShape,
    }).shift() as Resource)
  }

  return shapeCollections.get(entrypoint.term)
}

export
async function dereferencedShapes(role: NamedNode, ...[arg, state]: Parameters<ShapesLoader>) {
  const { client, entrypoint } = store.state.core
  if (!client) {
    return []
  }

  if (!dash.DetailsViewer.equals(state.viewer)) {
    return []
  }

  const shapesCollection = await getCollection(entrypoint, client)
  if (!isNamedNode(arg)) {
    return []
  }

  const searchParams = clownface({ dataset: $rdf.dataset() })
    .blankNode()
    .addOut(sh.targetNode, arg.term)

  const url = shapesCollection?.search?.expand(searchParams)
  if (!url) {
    return []
  }

  let shapePromise = shapePromises.get(url)
  if (!shapePromise) {
    shapePromise = client.loadResource<Collection>(url)
      .then(({ representation }) => {
        shapePromises.delete(url)
        return representation?.root
      })
    shapePromises.set(url, shapePromise)
  }

  const shapes = await shapePromise
  if (shapes && 'member' in shapes) {
    return shapes.member.map(m => m.pointer).sort(byOrder)
  }

  return []
}
