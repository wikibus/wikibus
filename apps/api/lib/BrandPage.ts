import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { dash, hydra, rdf, schema, skos } from '@tpluscode/rdf-ns-builders'
import dataset from 'rdf-dataset-ext'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'rdf-express-node-factory'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { knossos } from '@hydrofoil/vocabularies/builders'

export const fillTemplate: ResourceHook = async (req, pointer) => {
  const { uriTemplateVariables } = req.hydra.resource

  const shape = pointer.out(knossos.webPageShape)

  if (uriTemplateVariables) {
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

    // TODO: separate or declarative
    const mainEntity = pointer.node(req.hydra.term).out(schema.mainEntity).term
    if (mainEntity) {
      await dataset.fromStream(pointer.dataset, await CONSTRUCT`${req.hydra.term} ${hydra.title} ?title`
        .WHERE`
        ${mainEntity} ${skos.prefLabel} ?title
      `
        .execute(req.labyrinth.sparql.query))
    }
  }
}
