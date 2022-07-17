import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { dash, rdf, schema } from '@tpluscode/rdf-ns-builders'
import { knossos } from '@hydrofoil/vocabularies/builders'

export const fillTemplate: ResourceHook = async ({ req, pointer }) => {
  const { uriTemplateVariables } = req.hydra.resource
  if (!uriTemplateVariables) return

  const shape = pointer.out(knossos.webPageShape)

  pointer.addIn(schema.isBasedOn, req.hydra.term, (page) => {
    page
      .addOut(rdf.type, schema.WebPage)
      .addOut(dash.shape, shape)

    const templateQuads = uriTemplateVariables.dataset.match(uriTemplateVariables.term)
    for (const { predicate, object } of templateQuads) {
      if (object.termType === 'NamedNode') {
        page.addOut(predicate, req.rdf.namedNode(object.value))
      } else {
        page.addOut(predicate, object)
      }
    }
  })
}
