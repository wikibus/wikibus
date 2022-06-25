import { SingleEditor } from '@hydrofoil/shaperone-wc'
import $rdf from '@rdfjs/data-model'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { isLiteral } from 'is-graph-pointer'

const md = $rdf.namedNode('https://atomicdata.dev/datatypes/markdown')

export const MarkdownEditor: SingleEditor = {
  term: dash.MarkdownEditor,
  match(shape, node) {
    if (isLiteral(node) && md.equals(node.term.datatype)) {
      return 100
    }

    return 0
  },
}
