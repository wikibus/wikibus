import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { dash, hydra, rdf, schema, skos } from '@tpluscode/rdf-ns-builders/strict'
import { fromStream } from 'rdf-dataset-ext'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'rdf-express-node-factory'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { knossos } from '@hydrofoil/vocabularies/builders'

export const fillTemplate: ResourceHook = async (req, pointer) => {
  const mainEntityId = req.hydra.resource.mainEntity

  const shape = pointer.out(knossos.webPageShape)

  if (mainEntityId) {
    const mainEntity = req.rdf.namedNode(mainEntityId)
    pointer.addIn(schema.isBasedOn, req.hydra.term, (page) => {
      page
        .addOut(rdf.type, schema.WebPage)
        .addOut(schema.mainEntity, mainEntity)
        .addOut(dash.shape, shape)
    })

    await fromStream(pointer.dataset, await CONSTRUCT`${req.hydra.term} ${hydra.title} ?title`
      .WHERE`
        ${mainEntity} ${skos.prefLabel} ?title
      `
      .execute(req.labyrinth.sparql.query))
  }
}
