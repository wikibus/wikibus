import { ResourceHook } from '@hydrofoil/labyrinth/resource'
import { hydra, schema, skos } from '@tpluscode/rdf-ns-builders'
import dataset from 'rdf-dataset-ext'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'rdf-express-node-factory'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { isGraphPointer } from 'is-graph-pointer'
import { GraphPointer } from 'clownface'

interface Options {
  predicate?: GraphPointer
}

export const fillHydraTitle: ResourceHook<[Options]> =
  async ({ req, pointer }, { predicate } = {}) => {
    const mainEntity = req.hydra.resource.uriTemplateVariables?.out(schema.mainEntity)

    const predicateTerm = predicate ? predicate.term : skos.prefLabel

    if (isGraphPointer(mainEntity)) {
      await dataset.fromStream(pointer.dataset, await CONSTRUCT`${req.hydra.term} ${hydra.title} ?title`
        .WHERE`
        ${mainEntity.term} ${predicateTerm} ?title
      `
        .execute(req.labyrinth.sparql.query))
    }
  }
