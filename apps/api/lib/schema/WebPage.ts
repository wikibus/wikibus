import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { schema } from '@tpluscode/rdf-ns-builders'
import { GraphPointer } from 'clownface'
import $rdf from 'rdf-ext'
import { isGraphPointer } from 'is-graph-pointer'
import type { NamedNode } from '@rdfjs/types'

export const preserveAndForwardQuery: ResourceHook = (req, pointer) => {
  const { search } = new URL(req.absoluteUrl())
  if (search !== '') {
    const mainEntity = pointer.out(schema.mainEntity)
    if (isGraphPointer(mainEntity)) {
      pointer
        .deleteOut(schema.mainEntity)
        .addOut(schema.mainEntity, appendQuery(mainEntity, search, true))
    }

    rewriteQuads(pointer, appendQuery(pointer, search))
  }
}

function appendQuery(pointer: GraphPointer, query: string, pruneEmpty = false) {
  const newUrl = new URL(pointer.value)
  newUrl.search = query
  for (const [key, value] of newUrl.searchParams) {
    if (value === '' && pruneEmpty) {
      newUrl.searchParams.delete(key)
    }
  }

  return $rdf.namedNode(newUrl.toString())
}

function rewriteQuads(pointer: GraphPointer, term: NamedNode) {
  for (const quad of pointer.dataset.match(pointer.term)) {
    pointer.dataset.delete(quad)
    pointer.dataset.add($rdf.quad(term, quad.predicate, quad.object, quad.graph))
  }

  for (const quad of pointer.dataset.match(null, null, pointer.term)) {
    pointer.dataset.delete(quad)
    pointer.dataset.add($rdf.quad(quad.subject, quad.predicate, term, quad.graph))
  }
}
