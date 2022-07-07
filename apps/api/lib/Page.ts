import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { hydra, schema, skos } from '@tpluscode/rdf-ns-builders'
import dataset from 'rdf-dataset-ext'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'rdf-express-node-factory'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { isGraphPointer } from 'is-graph-pointer'

export const fillHydraTitle: ResourceHook = async (req, pointer) => {
  const mainEntity = req.hydra.resource.uriTemplateVariables?.out(schema.mainEntity)

  if (isGraphPointer(mainEntity)) {
    await dataset.fromStream(pointer.dataset, await CONSTRUCT`${req.hydra.term} ${hydra.title} ?title`
      .WHERE`
        ${mainEntity.term} ${skos.prefLabel} ?title
      `
      .execute(req.labyrinth.sparql.query))
  }
}
